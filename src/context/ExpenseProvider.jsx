/**
 * Owns the transaction list and persists it to localStorage.
 *
 * Transactions are always stored newest-first, which is also the order the list
 * renders in, so a newly added entry shows up at the top immediately.
 */
import { useCallback, useMemo } from 'react'
import { ExpenseContext } from './ExpenseContext.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { SAMPLE_TRANSACTIONS } from '../data/sampleTransactions.js'

const STORAGE_KEY = 'expense-tracker.transactions.v1'

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `txn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const byNewestFirst = (a, b) => {
  if (a.date === b.date) return b.createdAt - a.createdAt
  return a.date < b.date ? 1 : -1
}

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEY, [])

  const addTransaction = useCallback((values) => {
    const transaction = {
      ...values,
      id: createId(),
      amount: Number(values.amount),
      description: values.description.trim(),
      createdAt: Date.now(),
    }
    setTransactions((previous) =>
      [transaction, ...previous].sort(byNewestFirst),
    )
    return transaction
  }, [setTransactions])

  const deleteTransaction = useCallback((id) => {
    setTransactions((previous) => previous.filter((item) => item.id !== id))
  }, [setTransactions])

  const deleteAllTransactions = useCallback(() => {
    setTransactions([])
  }, [setTransactions])

  const loadSampleData = useCallback(() => {
    setTransactions(
      SAMPLE_TRANSACTIONS.map((item) => ({
        ...item,
        id: createId(),
        createdAt: Date.now() + SAMPLE_TRANSACTIONS.indexOf(item),
      })).sort(byNewestFirst),
    )
  }, [setTransactions])

  // `useMemo` keeps the context object identity stable so consumers do not
  // re-render on every parent render.
  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      deleteTransaction,
      deleteAllTransactions,
      loadSampleData,
    }),
    [
      transactions,
      addTransaction,
      deleteTransaction,
      deleteAllTransactions,
      loadSampleData,
    ],
  )

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}
