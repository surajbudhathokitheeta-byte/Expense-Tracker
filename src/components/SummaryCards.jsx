import { formatNPR } from '../utils/format.js'

/**
 * Three headline numbers for the selected month: income, expenses and the
 * running balance (income - expenses).
 */
export function SummaryCards({ income, expense, balance }) {
  const cards = [
    {
      key: 'income',
      label: 'Income',
      value: income,
      tone: 'income',
      hint: 'Money received this month',
    },
    {
      key: 'expense',
      label: 'Expenses',
      value: expense,
      tone: 'expense',
      hint: 'Money spent this month',
    },
    {
      key: 'balance',
      label: 'Balance',
      value: balance,
      tone: balance < 0 ? 'expense' : 'accent',
      hint: 'Income minus expenses',
    },
  ]

  return (
    <section className="summary" aria-label="Monthly summary">
      {cards.map((card) => (
        <article key={card.key} className={`summary__card summary__card--${card.tone}`}>
          <p className="summary__label">{card.label}</p>
          <p className="summary__value">{formatNPR(card.value)}</p>
          <p className="summary__hint">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
