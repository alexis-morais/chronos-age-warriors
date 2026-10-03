import { parisDateKey } from './rift'

/** First instant of the next Europe/Paris calendar day; binary search handles CET/CEST changes. */
export function nextParisMidnight(dayKey: string): number {
  let before = Date.parse(`${dayKey}T00:00:00Z`)
  let after = before + 24 * 60 * 60 * 1000
  while (after - before > 1) {
    const middle = Math.floor((before + after) / 2)
    if (parisDateKey(new Date(middle)) === dayKey) before = middle
    else after = middle
  }
  return after
}

export function riftCountdown(now: Date, midnight = nextParisMidnight(parisDateKey(now))): string {
  const total = Math.max(0, Math.ceil((midnight - now.getTime()) / 1000))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor(total % 3600 / 60)
  const seconds = total % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}
