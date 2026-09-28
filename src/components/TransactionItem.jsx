import { FALLBACK_CATEGORY, findCategory } from '../utils/categories.js'
import { formatDate, formatSignedNPR } from '../utils/format.js'

/** One row of the transaction list. Presentational only - all data via props. */
export function TransactionItem({ transaction, onDelete }) {
  const category = findCategory(transaction.category) ?? FALLBACK_CATEGORY
  const isIncome = transaction.type === 'income'

  return (
    <li className="txn">
      <span
        className="txn__dot"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />

      <div className="txn__main">
        <p className="txn__description">{transaction.description}</p>
        <p className="txn__meta">
          <span>{category.label}</span>
          <span className="txn__separator" aria-hidden="true">
            ·
          </span>
          <span>{formatDate(transaction.date)}</span>
        </p>
      </div>

      <p className={`txn__amount txn__amount--${isIncome ? 'income' : 'expense'}`}>
        {formatSignedNPR(transaction.amount, transaction.type)}
      </p>

      <button
        type="button"
        className="txn__delete"
        onClick={() => onDelete(transaction.id)}
        aria-label={`Delete ${transaction.description} of ${formatSignedNPR(
          transaction.amount,
          transaction.type,
        )} on ${formatDate(transaction.date)}`}
        title="Delete entry"
      >
        ✕
      </button>
    </li>
  )
}
