/**
 * Moves the dashboard between months. Forward navigation stops at the current
 * month because future transactions are rejected by the form.
 */
export function MonthNav({ monthTitle, onPrevious, onNext, canGoNext, onToday }) {
  return (
    <div className="monthnav">
      <div className="monthnav__controls">
        <button
          type="button"
          className="icon-btn"
          onClick={onPrevious}
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="monthnav__label" aria-live="polite">
          {monthTitle}
        </p>
        <button
          type="button"
          className="icon-btn"
          onClick={onNext}
          aria-label="Next month"
          disabled={!canGoNext}
        >
          ›
        </button>
      </div>
      <button type="button" className="btn-ghost" onClick={onToday}>
        This month
      </button>
    </div>
  )
}
