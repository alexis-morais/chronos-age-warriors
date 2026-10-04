import type { SupabaseClient } from '@supabase/supabase-js'
import { freshSave, parseAccountSave } from './storage'
import type { SaveData } from './types'

export interface CloudRow { save: SaveData; revision: number; updatedAt: string }
export interface CloudGateway {
  read(): Promise<CloudRow | null>
  write(expectedRevision: number, save: SaveData): Promise<{ status: 'saved' | 'conflict'; row: CloudRow | null }>
}
export interface CacheRecord extends CloudRow { dirty: boolean }
export type SyncStatus = 'synced' | 'pending' | 'offline' | 'conflict' | 'error'
export interface SaveConflict { device: CacheRecord; cloud: CloudRow | null }
export const accountCacheKey = (userId: string) => `chronos.save.${userId}`
export const OFFLINE_IDENTITY_KEY = 'chronos.offline-identity'

/** Monotonic receipts, not spendable balances: a bootstrap default cannot erase a career. */
export function losesProgress(candidate: SaveData, authoritative: SaveData): boolean {
  return Object.entries(authoritative.ownedWarriors).some(([id, warrior]) => !candidate.ownedWarriors[id]
    || candidate.ownedWarriors[id].level < warrior.level
    || candidate.ownedWarriors[id].level === warrior.level && candidate.ownedWarriors[id].xp < warrior.xp)
    || Object.keys(authoritative.owned).some((id) => !candidate.owned[id])
    || authoritative.defeatedNodes.some((node) => !candidate.defeatedNodes.includes(node))
    || authoritative.nemesisDefeatedNodes.some((node) => !candidate.nemesisDefeatedNodes.includes(node))
    || authoritative.badges.some((badge) => badge.unlockedAt && !candidate.badges.some((entry) => entry.id === badge.id && entry.unlockedAt))
    || (['adventureWins', 'riftWins', 'duelWins', 'chests', 'campaignNode', 'nemesisCampaignNode'] as const)
      .some((key) => candidate[key] < authoritative[key])
    || (['welcomeChestOpened', 'nemesisUnlocked', 'nemesisCompleted', 'normalBossFirstClearRewardClaimed', 'nemesisBossFirstClearRewardClaimed'] as const)
      .some((key) => authoritative[key] && !candidate[key])
}

export function readAccountCache(userId: string, storage: Pick<Storage, 'getItem'>): CacheRecord | null {
  try {
    const raw = storage.getItem(accountCacheKey(userId))
    if (!raw) return null
    const value = JSON.parse(raw) as Partial<CacheRecord>
    const save = parseAccountSave(value.save)
    if (!save || !Number.isSafeInteger(value.revision) || (value.revision ?? -1) < 0) return null
    return { save, revision: value.revision!, updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '', dirty: value.dirty === true }
  } catch { return null }
}

function writeCache(userId: string, storage: Pick<Storage, 'setItem'>, record: CacheRecord) {
  storage.setItem(accountCacheKey(userId), JSON.stringify(record))
}

function parseCloudRow(value: unknown): CloudRow {
  if (!value || typeof value !== 'object') throw new Error('Sauvegarde cloud invalide.')
  const row = value as Record<string, unknown>
  const save = parseAccountSave(row.save_data)
  if (!save || !Number.isSafeInteger(row.revision) || (row.revision as number) < 1) throw new Error('Sauvegarde cloud invalide.')
  return { save, revision: row.revision as number, updatedAt: String(row.updated_at ?? '') }
}

export function transientNetworkFailure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(message)
}

export function supabaseGateway(client: SupabaseClient, userId: string): CloudGateway {
  return {
    async read() {
      const { data, error } = await client.from('game_saves').select('save_data,revision,updated_at').eq('user_id', userId).maybeSingle()
      if (error) throw error
      return data ? parseCloudRow(data) : null
    },
    async write(expectedRevision, save) {
      const { data, error } = await client.rpc('save_game', { expected_revision: expectedRevision, next_save_data: save, next_save_version: save.version })
      if (error) throw error
      if (!data || (data.status !== 'saved' && data.status !== 'conflict')) throw new Error('Réponse de sauvegarde cloud invalide.')
      return { status: data.status as 'saved' | 'conflict', row: data.save_data ? parseCloudRow(data) : null }
    },
  }
}

export class CloudSaveManager {
  private record: CacheRecord | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private writing = false
  private checking = false
  private disposed = false
  private conflict: SaveConflict | null = null
  private onStatus: (status: SyncStatus) => void
  private onConflict: (conflict: SaveConflict) => void
  private onSave: (save: SaveData) => void

  constructor(private userId: string, private storage: Pick<Storage, 'getItem' | 'setItem'>,
    private gateway: CloudGateway, private online: () => boolean,
    callbacks: { onStatus: (status: SyncStatus) => void; onConflict: (conflict: SaveConflict) => void; onSave: (save: SaveData) => void }) {
    this.onStatus = callbacks.onStatus; this.onConflict = callbacks.onConflict; this.onSave = callbacks.onSave
  }

  get current() { return this.record?.save ?? null }
  get hasPendingChanges() { return Boolean(this.record?.dirty || this.conflict || this.writing) }

  async readyForServerMutation() {
    if (!this.online() || this.conflict || !this.record) return false
    for (let attempt = 0; attempt < 100 && this.writing; attempt++) await new Promise((resolve) => setTimeout(resolve, 50))
    if (this.record.dirty) await this.flush()
    return !this.record.dirty && !this.writing && !this.conflict && this.online()
  }

  async refreshAfterServerMutation() {
    for (let attempt = 0; attempt < 100 && (this.writing || this.checking); attempt++) await new Promise((resolve) => setTimeout(resolve, 50))
    if (this.disposed || !this.record || this.record.dirty || this.writing || this.checking || !this.online()) throw new Error('Synchronisation cloud en attente.')
    const cloud = await this.gateway.read()
    if (!cloud) throw new Error('Sauvegarde cloud introuvable.')
    this.record = { ...cloud, dirty: false }
    writeCache(this.userId, this.storage, this.record)
    this.onSave(cloud.save); this.onStatus('synced')
  }

  async initialize(allowOffline: boolean): Promise<SaveData> {
    const cache = readAccountCache(this.userId, this.storage)
    if (!this.online()) {
      if (!allowOffline || !cache) throw new Error('Connexion Internet requise.')
      this.record = cache; this.onStatus('offline'); return cache.save
    }
    let cloud: CloudRow | null
    try { cloud = await this.gateway.read() }
    catch (error) {
      if (!allowOffline || !cache || !transientNetworkFailure(error)) throw error
      this.record = cache; this.onStatus('offline'); return cache.save
    }
    if (!cloud && !cache) {
      return this.createInitial()
    }
    if (cache?.dirty) {
      this.record = cache
      if (cache.revision !== (cloud?.revision ?? 0) || cloud && losesProgress(cache.save, cloud.save)) this.setConflict(cloud)
      else { this.onStatus('pending'); void this.flush() }
      return cache.save
    }
    if (!cloud) {
      // A clean cache with no server row is not an authoritative save.
      return this.createInitial()
    }
    this.record = { ...cloud, dirty: false }
    writeCache(this.userId, this.storage, this.record)
    this.onStatus('synced')
    return cloud.save
  }

  private async createInitial(): Promise<SaveData> {
    const initial = freshSave()
    const result = await this.gateway.write(0, initial)
    const row = result.status === 'saved' ? result.row : await this.gateway.read()
    if (!row) throw new Error('Création de sauvegarde cloud impossible.')
    this.record = { ...row, dirty: false }
    writeCache(this.userId, this.storage, this.record)
    this.onStatus('synced')
    return row.save
  }

  change(save: SaveData) {
    if (this.disposed || !this.record) return
    const previous = this.record
    if (losesProgress(save, previous.save)) {
      // Reject a runtime reset before touching the cache. The previous snapshot may
      // still be dirty: never relabel it as a clean server version and lose its work.
      this.onSave(previous.save)
      this.onStatus('error')
      return
    }
    this.record = { ...this.record, save, dirty: true, updatedAt: new Date().toISOString() }
    writeCache(this.userId, this.storage, this.record)
    if (!this.conflict) this.onStatus(this.online() ? 'pending' : 'offline')
    this.schedule()
  }

  offline() { if (!this.disposed) this.onStatus('offline') }

  private schedule() {
    if (this.timer) clearTimeout(this.timer)
    if (this.disposed || this.conflict || !this.online()) return
    this.timer = setTimeout(() => { this.timer = null; void this.flush() }, 500)
  }

  async flush() {
    if (this.disposed || this.writing || this.conflict || !this.record?.dirty || !this.online()) return
    this.writing = true
    try {
      while (!this.disposed && this.record?.dirty && !this.conflict && this.online()) {
        const snapshot = this.record.save
        const result = await this.gateway.write(this.record.revision, snapshot)
        if (this.disposed) return
        if (result.status === 'conflict') { this.setConflict(result.row); break }
        if (!result.row) throw new Error('Révision cloud manquante.')
        const changedAgain = this.record.save !== snapshot
        const newRecord: CacheRecord = { ...this.record, revision: result.row.revision, updatedAt: changedAgain ? this.record.updatedAt : result.row.updatedAt, dirty: changedAgain }
        this.record = newRecord
        writeCache(this.userId, this.storage, newRecord)
        this.onStatus(newRecord.dirty ? 'pending' : 'synced')
      }
    } catch {
      this.onStatus(this.online() ? 'error' : 'offline')
      // Keep the local dirty cache; online/retry can safely resend with CAS.
      if (!this.disposed) this.timer = setTimeout(() => { this.timer = null; void this.flush() }, 5000)
    } finally { this.writing = false }
  }

  async reconnect() {
    if (this.disposed || !this.record || !this.online() || this.conflict || this.writing || this.checking) return
    this.checking = true
    try {
      const cloud = await this.gateway.read()
      if (this.disposed || !this.record) return
      if (this.record.dirty) {
        if (this.record.revision !== (cloud?.revision ?? 0) || cloud && losesProgress(this.record.save, cloud.save)) this.setConflict(cloud)
        else void this.flush()
      } else if (cloud && cloud.revision !== this.record.revision) {
        this.record = { ...cloud, dirty: false }
        writeCache(this.userId, this.storage, this.record)
        this.onSave(cloud.save); this.onStatus('synced')
      }
    } catch { this.onStatus('error') }
    finally { this.checking = false }
  }

  private setConflict(cloud: CloudRow | null) {
    if (!this.record) return
    this.conflict = { device: this.record, cloud }
    this.onStatus('conflict'); this.onConflict(this.conflict)
  }

  chooseCloud() {
    if (!this.conflict) return
    const cloud = this.conflict.cloud
    this.conflict = null
    this.record = cloud ? { ...cloud, dirty: false } : { save: freshSave(), revision: 0, updatedAt: '', dirty: false }
    writeCache(this.userId, this.storage, this.record)
    this.onSave(this.record.save); this.onStatus('synced')
  }

  async chooseDevice() {
    if (!this.conflict || !this.record) return false
    const cloud = await this.gateway.read()
    this.record = { ...this.record, revision: cloud?.revision ?? 0, dirty: true }
    writeCache(this.userId, this.storage, this.record)
    this.conflict = null
    this.onStatus('pending')
    await this.flush()
    if (this.record?.dirty && !this.conflict) this.setConflict(cloud)
    return !this.conflict && this.record?.dirty === false
  }

  dispose() { this.disposed = true; if (this.timer) clearTimeout(this.timer) }
}
