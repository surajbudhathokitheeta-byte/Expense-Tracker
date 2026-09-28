import { useState } from 'react'
import {
  WEEKDAY_LABELS,
  buildMonthGrid,
  monthLabel,
  shiftMonth,
  toMonthKey,
} from '../utils/calendar.js'
import { formatDate } from '../utils/format.js'

/**
 * A small controlled month calendar used as the date picker.
 *
 * Props:
 *   value     - selected date as "YYYY-MM-DD"
 *   onChange  - called with the newly picked "YYYY-MM-DD"
 *   maxDate   - latest selectable date (today); later days are disabled
 *
 * The visible month is internal state. When the selected date changes from
 * outside the calendar the visible month is re-aligned during render (React's
 * "adjust state while rendering" pattern) instead of in an effect, which would
 * cost an extra render pass.
 */
export function Calendar({ value, onChange, maxDate, id, invalid }) {
  const monthOf = (iso) => toMonthKey(new Date(`${iso}T00:00:00`))

  const [viewKey, setViewKey] = useState(() => monthOf(value))
  const [lastValue, setLastValue] = useState(value)

  if (value !== lastValue) {
    setLastValue(value)
    setViewKey(monthOf(value))
  }

  const { days } = buildMonthGrid(viewKey)
  const maxMonthKey = monthOf(maxDate)

  return (
    <div className="calendar" id={id}>
      <div className="calendar__head">
        <button
          type="button"
          className="calendar__nav"
          onClick={() => setViewKey((key) => shiftMonth(key, -1))}
          aria-label="Show previous month"
        >
          ‹
        </button>
        <p className="calendar__month">{monthLabel(viewKey)}</p>
        <button
          type="button"
          className="calendar__nav"
          onClick={() => setViewKey((key) => shiftMonth(key, 1))}
          aria-label="Show next month"
          disabled={viewKey >= maxMonthKey}
        >
          ›
        </button>
      </div>

      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="calendar__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="calendar__grid" role="group" aria-label="Choose a date">
        {days.map((iso, index) => {
          if (iso === null) {
            return <span key={`empty-${index}`} className="calendar__day calendar__day--empty" />
          }
          const isSelected = iso === value
          const isToday = iso === maxDate
          const isDisabled = iso > maxDate

          return (
            <button
              key={iso}
              type="button"
              className={[
                'calendar__day',
                isSelected ? 'calendar__day--selected' : '',
                isToday ? 'calendar__day--today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChange(iso)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              aria-label={formatDate(iso)}
              aria-current={isToday ? 'date' : undefined}
              aria-invalid={isSelected && invalid ? 'true' : undefined}
            >
              {Number(iso.slice(8, 10))}
            </button>
          )
        })}
      </div>
    </div>
  )
}
