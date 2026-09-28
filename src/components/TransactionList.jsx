import { useMemo } from 'react'
import { FilterBar } from './FilterBar.jsx'
import { TransactionItem } from './TransactionItem.jsx'
import { EmptyState } from './EmptyState.jsx'
import { useExpenses } from '../context/ExpenseContext.js'
import { resolveCategoryId } from '../utils/categories.js'

const COMPARATORS = {
  'date-desc': (a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1),
  'date-asc': (a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date > b.date ? 1 : -1),
  'amount-desc': (a, b) => b.amount - a.amount,
  'amount-asc': (a, b) => a.amount - b.amount,
}

/**
 * Renders the transactions of one month, filtered and sorted by the FilterBar.
 *
 * The list reads the transactions from context (it is read-only), while the
 * active month and filters arrive as props from App.
 */
export function TransactionList({ month, filters, onFiltersChange, onDelete, onLoadSample }) {
  const { transactions } = useExpenses()

  const { inThisMonth, monthTransactions } = useMemo(() => {
    const inMonth = transactions.filter((item) => item.date.slice(0, 7) === month.key)
    return {
      inThisMonth: inMonth,
      monthTransactions: inMonth
        .filter((item) => filters.type === 'all' || item.type === filters.type)
        // Compare resolved ids, so an entry stored under an older category name
        // is still matched by the filter that represents it today.
        .filter((item) => filters.category === 'all' || resolveCategoryId(item.category) === filters.category)
        .sort(COMPARATORS[filters.sort]),
    }
  }, [transactions, month.key, filters.type, filters.category, filters.sort])

  const isFiltered =
    filters.type !== 'all' || filters.category !== 'all' || filters.sort !== 'date-desc'

  return (
    <section className="panel" aria-labelledby="transactions-heading">
      <div className="panel__head">
        <h2 id="transactions-heading" className="panel__title">
          Transactions
        </h2>
        <p className="panel__sub">{month.label}</p>
      </div>

      <FilterBar
        filters={filters}
        onChange={onFiltersChange}
        onReset={() =>
          onFiltersChange({ type: 'all', category: 'all', sort: 'date-desc' })
        }
        resultCount={monthTransactions.length}
        totalCount={inThisMonth.length}
      />

      {monthTransactions.length === 0 ? (
        <EmptyState
          icon="≡"
          title={isFiltered ? 'No entries match these filters' : `Nothing recorded in ${month.label}`}
          description={
            isFiltered
              ? 'Try a different category, type or sort order.'
              : 'Add your first entry with the form, or load a small demo data set to see how the app works.'
          }
          action={
            !isFiltered ? (
              <button type="button" className="btn-ghost" onClick={onLoadSample}>
                Load sample data
              </button>
            ) : null
          }
        />
      ) : (
        <ul className="txn-list">
          {monthTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
