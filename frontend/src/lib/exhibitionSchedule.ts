/**
 * Exhibition "current" / "upcoming" uses calendar dates in Europe/Stockholm
 * so the site matches Swedish visitors and avoids UTC midnight skew on the server.
 */
const EXHIBITION_TZ = 'Europe/Stockholm'

function calendarDateKeyInTimeZone(date: Date, timeZone: string): number {
  const s = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  const [y, m, d] = s.split('-').map((x) => parseInt(x, 10))
  return y * 10000 + m * 100 + d
}

function storedDateToKey(dateStr: string | null | undefined): number | null {
  if (dateStr == null || String(dateStr).trim() === '') return null
  const s = String(dateStr).trim()
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return (
      parseInt(match[1], 10) * 10000 +
      parseInt(match[2], 10) * 100 +
      parseInt(match[3], 10)
    )
  }
  const t = new Date(s)
  if (Number.isNaN(t.getTime())) return null
  return calendarDateKeyInTimeZone(t, EXHIBITION_TZ)
}

function hasDateValue(v: string | null | undefined): boolean {
  return v != null && String(v).trim() !== ''
}

export function deriveScheduleFromDates(row: {
  start_date?: string | null
  end_date?: string | null
}): { is_current: boolean; is_upcoming: boolean } {
  const todayKey = calendarDateKeyInTimeZone(new Date(), EXHIBITION_TZ)
  const startKey = hasDateValue(row.start_date) ? storedDateToKey(row.start_date) : null
  const endKey = hasDateValue(row.end_date) ? storedDateToKey(row.end_date) : null

  let is_current = false
  let is_upcoming = false

  if (startKey != null && endKey != null) {
    is_upcoming = startKey > todayKey
    is_current = startKey <= todayKey && endKey >= todayKey
  } else if (startKey != null && endKey == null) {
    is_upcoming = startKey > todayKey
    is_current = startKey <= todayKey
  } else if (startKey == null && endKey != null) {
    is_current = endKey >= todayKey
    is_upcoming = false
  }

  return { is_current, is_upcoming }
}

/** When start/end exist, derive from Stockholm calendar dates; otherwise use API flags (manual / DB). */
export function effectiveExhibitionSchedule(row: {
  start_date?: string | null
  end_date?: string | null
  is_current?: boolean
  is_upcoming?: boolean
}): { is_current: boolean; is_upcoming: boolean } {
  if (hasDateValue(row.start_date) || hasDateValue(row.end_date)) {
    return deriveScheduleFromDates(row)
  }
  return {
    is_current: Boolean(row.is_current),
    is_upcoming: Boolean(row.is_upcoming),
  }
}
