import { useMemo, useState } from 'react'
import { Header } from './components/Header.jsx'
import { SummaryCards } from './components/SummaryCards.jsx'
import { MonthNav } from './components/MonthNav.jsx'
import { TransactionForm } from './components/TransactionForm.jsx'
import { TransactionList } from './components/TransactionList.jsx'
import { CategoryChart } from './components/CategoryChart.jsx'
import { useExpenses } from './context/ExpenseContext.js'
import { currentMonthKey, monthLabel, shiftMonth, todayISO } from './utils/calendar.js'
import { FALLBACK_CATEGORY, findCategory, resolveCategoryId } from './utils/categories.js'

const DEFAULT_FILTERS = { type: 'all', category: 'all', sort: 'date-desc' }

export default function App() {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    deleteAllTransactions,
    loadSampleData,
  } = useExpenses()

  const today = todayISO()
  const thisMonthKey = currentMonthKey()

  const [monthKey, setMonthKey] = useState(thisMonthKey)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // Every number on the dashboard is derived from the transactions of the
  // selected month, so `useMemo` keeps the recalculation off the render path.
  const monthTransactions = useMemo(
    () => transactions.filter((item) => item.date.slice(0, 7) === monthKey),
    [transactions, monthKey],
  )

  const totals = useMemo(
    () =>
      monthTransactions.reduce(
        (summary, item) => {
          if (item.type === 'income') summary.income += item.amount
          else summary.expense += item.amount
          summary.balance = summary.income - summary.expense
          return summary
        },
        { income: 0, expense: 0, balance: 0 },
      ),
    [monthTransactions],
  )

  const categoryBreakdown = useMemo(() => {
    const byCategory = new Map()
    monthTransactions.forEach((item) => {
      if (item.type !== 'expense') return
      // Group by the resolved id so an older stored category and its modern
      // equivalent share one bar instead of splitting into two.
      const id = resolveCategoryId(item.category)
      byCategory.set(id, (byCategory.get(id) ?? 0) + item.amount)
    })
    return [...byCategory.entries()]
      .map(([id, value]) => {
        const category = findCategory(id) ?? FALLBACK_CATEGORY
        return { id, value, label: category.label, color: category.color }
      })
      .sort((a, b) => b.value - a.value)
  }, [monthTransactions])

  function handleAdd(values) {
    const created = addTransaction(values)
    // Jump the dashboard to the month the entry belongs to.
    setMonthKey(created.date.slice(0, 7))
  }

  function handleResetAll() {
    const confirmed = window.confirm(
      'Delete every transaction? This cannot be undone.',
    )
    if (confirmed) deleteAllTransactions()
  }

  const month = { key: monthKey, label: monthLabel(monthKey) }

  return (
    <div className="app">
      <div className="app__inner">
        <Header
          monthTitle={month.label}
          transactionCount={monthTransactions.length}
          onResetAll={handleResetAll}
        />

        <MonthNav
          monthTitle={month.label}
          onPrevious={() => setMonthKey((key) => shiftMonth(key, -1))}
          onNext={() => setMonthKey((key) => shiftMonth(key, 1))}
          canGoNext={monthKey < thisMonthKey}
          onToday={() => setMonthKey(thisMonthKey)}
        />

        <SummaryCards
          income={totals.income}
          expense={totals.expense}
          balance={totals.balance}
        />

        <main className="layout">
          <div className="layout__side">
            <TransactionForm onAdd={handleAdd} today={today} />
          </div>

          <div className="layout__main">
            <CategoryChart data={categoryBreakdown} monthLabel={month.label} />
            <TransactionList
              month={month}
              filters={filters}
              onFiltersChange={setFilters}
              onDelete={deleteTransaction}
              onLoadSample={loadSampleData}
            />
          </div>
        </main>

        <footer className="app__footer">
          <p>
            All amounts are in Nepali Rupees (NPR) and are stored only in this
            browser&rsquo;s localStorage.
          </p>
        </footer>
      </div>
    </div>
  )
}
