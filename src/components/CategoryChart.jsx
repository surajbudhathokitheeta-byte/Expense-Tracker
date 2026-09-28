import { useState } from 'react'
import { EmptyState } from './EmptyState.jsx'
import { formatNPR, formatNPRCompact } from '../utils/format.js'

const RADIUS = 64
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Spending split by category for the selected month.
 *
 * Two views of the same data:
 *  - "bar"  : plain CSS bars (percentage width), so it scales with the layout
 *  - "pie"  : an SVG donut built from stroke-dasharray segments
 *
 * No chart library is used - the dataset is small enough that a handful of
 * divs and one SVG circle do the job.
 */
export function CategoryChart({ data, monthLabel }) {
  const [view, setView] = useState('bar')

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const largest = data.reduce((max, item) => Math.max(max, item.value), 0)

  // Turn absolute values into donut segments. `prefixSums` holds the running
  // total *before* each category, so slice i starts where slice i-1 ended.
  const prefixSums = data.reduce(
    (sums, item) => [...sums, sums[sums.length - 1] + item.value],
    [0],
  )

  const segments = data.map((item, index) => ({
    ...item,
    length: (item.value / total) * CIRCUMFERENCE,
    offset: (prefixSums[index] / total) * CIRCUMFERENCE,
  }))

  return (
    <section className="panel" aria-labelledby="chart-heading">
      <div className="panel__head panel__head--row">
        <div>
          <h2 id="chart-heading" className="panel__title">
            Spending by category
          </h2>
          <p className="panel__sub">{monthLabel}</p>
        </div>
        <div className="segment segment--small" role="group" aria-label="Chart type">
          {['bar', 'pie'].map((option) => (
            <button
              key={option}
              type="button"
              className={`segment__option segment__option--${option}${
                view === option ? ' is-active' : ''
              }`}
              aria-pressed={view === option}
              onClick={() => setView(option)}
            >
              {option === 'bar' ? 'Bar' : 'Pie'}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon="◔"
          title="No spending to chart"
          description="Once you record an expense in this month, the category split appears here."
        />
      ) : (
        <div className="chart">
          {view === 'bar' ? (
            <ul className="bars">
              {data.map((item) => (
                <li key={item.id} className="bars__row">
                  <span className="bars__label" title={item.label}>
                    <span
                      className="bars__swatch"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    {item.label}
                  </span>
                  <span className="bars__track">
                    <span
                      className="bars__fill"
                      style={{
                        width: `${(item.value / largest) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </span>
                  <span className="bars__value">{formatNPRCompact(item.value)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pie">
              <div className="pie__canvas">
                <svg viewBox="0 0 160 160" role="img" aria-label="Spending split by category">
                  {segments.map((segment) => (
                    <circle
                      key={segment.id}
                      cx="80"
                      cy="80"
                      r={RADIUS}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={STROKE}
                      strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                      strokeDashoffset={-segment.offset}
                      transform="rotate(-90 80 80)"
                    />
                  ))}
                </svg>
                <div className="pie__center">
                  <span>Total spent</span>
                  <strong>{formatNPRCompact(total)}</strong>
                </div>
              </div>

              <ul className="legend">
                {data.map((item) => (
                  <li key={item.id} className="legend__row">
                    <span
                      className="legend__swatch"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="legend__label">{item.label}</span>
                    <span className="legend__share">
                      {Math.round((item.value / total) * 100)}%
                    </span>
                    <span className="legend__value">{formatNPR(item.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
