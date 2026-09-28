/**
 * Small date helpers built on plain `Date` objects.
 *
 * Every transaction date is stored as a "YYYY-MM-DD" string so that it can be
 * compared with a simple string check (`date > today`) and grouped by month
 * with `date.slice(0, 7)` — no timezone surprises.
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Weeks start on Sunday, which is the convention used in Nepal. */
export const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const pad = (n) => String(n).padStart(2, '0')

/** Date -> "YYYY-MM-DD" */
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Date -> "YYYY-MM" */
export function toMonthKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function currentMonthKey() {
  return toMonthKey(new Date())
}

/** "2026-03" -> { year: 2026, monthIndex: 2 } */
export function parseMonthKey(key) {
  const [year, month] = key.split('-').map(Number)
  return { year, monthIndex: month - 1 }
}

/** "2026-03" -> "March 2026" */
export function monthLabel(key) {
  const { year, monthIndex } = parseMonthKey(key)
  return `${MONTH_NAMES[monthIndex]} ${year}`
}

/** "2026-03" + 1 -> "2026-04" (handles year boundaries) */
export function shiftMonth(key, delta) {
  const { year, monthIndex } = parseMonthKey(key)
  const shifted = new Date(year, monthIndex + delta, 1)
  return toMonthKey(shifted)
}

/**
 * Builds the 6x7 cell list for a month calendar.
 * Empty slots (from the previous/next month) are `null` so the grid keeps a
 * stable height and the buttons stay aligned.
 */
export function buildMonthGrid(key) {
  const { year, monthIndex } = parseMonthKey(key)
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const cells = Array(firstWeekday).fill(null)
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toISODate(new Date(year, monthIndex, day)))
  }
  while (cells.length % 7 !== 0) cells.push(null)

  return { year, monthIndex, days: cells }
}
