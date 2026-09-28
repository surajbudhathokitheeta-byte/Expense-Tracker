/**
 * Form validation for a single transaction.
 *
 * Keeping the rules in one pure function (rather than inside the component)
 * means the form only has to call `validate()` and render whatever errors come
 * back — the rules themselves stay easy to read, test and reuse.
 */

export const MAX_AMOUNT = 10_000_000
export const MIN_DESCRIPTION = 3
export const MAX_DESCRIPTION = 60
export const EARLIEST_DATE = '2000-01-01'

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function validateTransaction(values, today) {
  const errors = {}

  // --- Amount: required, positive, max 2 decimal places, capped ---
  const amount = String(values.amount ?? '').trim()
  if (amount === '') {
    errors.amount = 'Amount is required.'
  } else if (!AMOUNT_PATTERN.test(amount)) {
    errors.amount = 'Use numbers only, with up to 2 decimals (e.g. 1500 or 1500.50).'
  } else if (Number(amount) <= 0) {
    errors.amount = 'Amount must be greater than 0.'
  } else if (Number(amount) > MAX_AMOUNT) {
    errors.amount = `Amount cannot be more than ${MAX_AMOUNT.toLocaleString('en-IN')}.`
  }

  // --- Type: must be one of the two supported kinds ---
  if (values.type !== 'income' && values.type !== 'expense') {
    errors.type = 'Choose either Income or Expense.'
  }

  // --- Category: required dropdown value ---
  if (!values.category) {
    errors.category = 'Select a category.'
  }

  // --- Description: required, trimmed, length limited ---
  const description = String(values.description ?? '').trim()
  if (description === '') {
    errors.description = 'Description is required.'
  } else if (description.length < MIN_DESCRIPTION) {
    errors.description = `Use at least ${MIN_DESCRIPTION} characters.`
  } else if (description.length > MAX_DESCRIPTION) {
    errors.description = `Keep it under ${MAX_DESCRIPTION} characters.`
  }

  // --- Date: real calendar date, not in the future, not before 2000 ---
  const date = String(values.date ?? '')
  if (!ISO_PATTERN.test(date)) {
    errors.date = 'Pick a date from the calendar.'
  } else if (Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    errors.date = 'That date does not exist.'
  } else if (date > today) {
    errors.date = 'Date cannot be in the future.'
  } else if (date < EARLIEST_DATE) {
    errors.date = 'Date must be on or after 01 Jan 2000.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

/**
 * Keeps the amount field numeric while typing: digits, a single dot, and no
 * more than two decimal places. Cheaper and nicer than validating keystrokes.
 */
export function sanitiseAmountInput(raw) {
  let next = String(raw).replace(/[^0-9.]/g, '')
  const firstDot = next.indexOf('.')
  if (firstDot !== -1) {
    next = next.slice(0, firstDot + 1) + next.slice(firstDot + 1).replace(/\./g, '')
    const [whole, decimals] = next.split('.')
    next = `${whole}.${(decimals ?? '').slice(0, 2)}`
  }
  return next
}
