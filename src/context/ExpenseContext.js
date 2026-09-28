/**
 * The shared "expense store".
 *
 * Summary cards, the chart and the transaction list all need the same list of
 * transactions. Passing it through props would mean drilling it through every
 * intermediate component, so it lives in a Context instead. Components that
 * only *read* it use `useExpenses()`; the one component that may *change* it
 * is `ExpenseProvider`.
 */
import { createContext, useContext } from 'react'

export const ExpenseContext = createContext(null)

/** Reads the transaction list and its actions. Throws if used outside the provider. */
export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === null) {
    throw new Error('useExpenses must be used inside <ExpenseProvider>.')
  }
  return context
}
