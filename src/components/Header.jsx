/**
 * Page header: branding, the month currently being reviewed, and a reset action.
 */
export function Header({ monthTitle, transactionCount, onResetAll }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true">
          NPR
        </span>
        <div>
          <h1 className="app-header__title">Expense Tracker</h1>
          <p className="app-header__subtitle">
            Track income and spending in Nepali Rupees
          </p>
        </div>
      </div>

      <div className="app-header__meta">
        <p className="app-header__month">{monthTitle}</p>
        <p className="app-header__count">
          {transactionCount === 0
            ? 'No entries yet'
            : `${transactionCount} ${transactionCount === 1 ? 'entry' : 'entries'} in this month`}
        </p>
      </div>

      <button
        type="button"
        className="btn-ghost btn-ghost--onDark"
        onClick={onResetAll}
        disabled={transactionCount === 0}
      >
        Reset all data
      </button>
    </header>
  )
}
