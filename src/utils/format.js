/**
 * Formatting helpers.
 *
 * All money in this app is Nepali Rupees (NPR / रू). Nepal groups digits using
 * the lakh-crore system (1,00,000), which is what the `en-IN` locale produces,
 * so `NPR 1,25,000.00` instead of the US-style `NPR 125,000.00`.
 */

const nprFull = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const nprShort = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 1234.5 -> "NPR 1,234.50" */
export function formatNPR(amount) {
  const value = Number(amount)
  return `NPR ${nprFull.format(Number.isFinite(value) ? value : 0)}`
}

/** 123400 -> "NPR 1.2L"  (used for the small chart labels) */
export function formatNPRCompact(amount) {
  const value = Number(amount)
  return `NPR ${nprShort.format(Number.isFinite(value) ? value : 0)}`
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** "2026-03-12" -> "12 Mar 2026" */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return dateFormatter.format(date)
}

/** 1000 / "income" -> "+NPR 1,000.00" */
export function formatSignedNPR(amount, type) {
  const sign = type === 'income' ? '+' : '−'
  return `${sign}${formatNPR(amount)}`
}
