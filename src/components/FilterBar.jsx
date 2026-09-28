import { categoriesFor } from '../utils/categories.js'

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Largest amount' },
  { value: 'amount-asc', label: 'Smallest amount' },
]

/**
 * Category / type / sort controls for the transaction list.
 * A single `filters` object is passed down and updated with one callback, so
 * the list never has to know about individual filter fields.
 */
export function FilterBar({ filters, onChange, onReset, resultCount, totalCount }) {
  const isFiltered =
    filters.category !== 'all' || filters.type !== 'all' || filters.sort !== 'date-desc'

  return (
    <div className="filterbar">
      <div className="filterbar__fields">
        <label className="filterbar__field">
          <span>Type</span>
          <select
            name="filterType"
            className="input input--compact"
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label className="filterbar__field">
          <span>Category</span>
          <select
            name="filterCategory"
            className="input input--compact"
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value })}
          >
            <option value="all">All categories</option>
            {[...categoriesFor('expense'), ...categoriesFor('income')].map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filterbar__field">
          <span>Sort</span>
          <select
            name="filterSort"
            className="input input--compact"
            value={filters.sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="filterbar__count">
        Showing {resultCount} of {totalCount}
        {isFiltered ? (
          <button type="button" className="link-btn" onClick={onReset}>
            Clear filters
          </button>
        ) : null}
      </p>
    </div>
  )
}
