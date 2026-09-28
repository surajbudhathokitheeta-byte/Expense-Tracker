/**
 * Categories available in the add-transaction form.
 *
 * Each category owns one colour that is reused by the chart and the list rows,
 * so the same spending bucket always looks the same everywhere in the UI.
 *
 * The palette is deliberately small and muted: the eight expense colours sit at
 * a similar lightness and warmth so the bar and donut charts read as one calm
 * set rather than a rainbow, and income stays in the green family so that colour
 * itself carries the "money in" signal.
 */

export const EXPENSE_CATEGORIES = [
  { id: 'housing', label: 'Rent & Bills', color: '#4a6274' },
  { id: 'food', label: 'Food & Drink', color: '#b5643c' },
  { id: 'transport', label: 'Transport', color: '#3e7f82' },
  { id: 'education', label: 'Education', color: '#55608c' },
  { id: 'shopping', label: 'Shopping', color: '#8a6480' },
  { id: 'health', label: 'Health', color: '#a9524f' },
  { id: 'travel', label: 'Travel', color: '#5f8557' },
  { id: 'other-expense', label: 'Other', color: '#8a857c' },
]

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', color: '#2e7d5b' },
  { id: 'freelance', label: 'Freelance', color: '#357f76' },
  { id: 'other-income', label: 'Other Income', color: '#6e9187' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

/** Shown for any category id the app does not recognise. */
export const FALLBACK_CATEGORY = {
  id: 'other-expense',
  label: 'Other',
  color: '#8a857c',
}

/**
 * Earlier versions of this project stored more, narrower categories. Data that
 * is already in a browser's localStorage is kept, not thrown away, so those ids
 * are mapped onto the closest category that exists today.
 */
const CATEGORY_ALIASES = {
  groceries: 'food',
  rent: 'housing',
  utilities: 'housing',
  entertainment: 'other-expense',
  gifts: 'other-expense',
  'gift-received': 'other-income',
  interest: 'other-income',
}

/** The id a stored category should be treated as today. */
export function resolveCategoryId(id) {
  return CATEGORY_ALIASES[id] ?? id
}

/** Categories that make sense for the selected transaction type. */
export function categoriesFor(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function findCategory(id) {
  return ALL_CATEGORIES.find((c) => c.id === resolveCategoryId(id)) ?? null
}
