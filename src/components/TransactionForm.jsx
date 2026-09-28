import { useMemo, useState } from 'react'
import { Calendar } from './Calendar.jsx'
import { categoriesFor } from '../utils/categories.js'
import { sanitiseAmountInput, validateTransaction } from '../utils/validation.js'
import { formatDate, formatNPR } from '../utils/format.js'

const emptyForm = (today) => ({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: today,
})

/** A label + control + error message, so every field looks the same. */
function Field({ label, error, hint, htmlFor, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <div className="field__top">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
        {hint ? <span className="field__hint">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Controlled form for adding one transaction.
 *
 * Every input reads from `values` and writes back through `update`, so the
 * component is the single source of truth for what the user has typed.
 * Validation errors are derived (useMemo) rather than stored, and are only
 * revealed for fields the user has already touched - so the form does not
 * shout at someone before they have typed anything.
 */
export function TransactionForm({ onAdd, today }) {
  const [values, setValues] = useState(() => emptyForm(today))
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState(null)

  const { isValid, errors } = useMemo(
    () => validateTransaction(values, today),
    [values, today],
  )

  const categoryOptions = categoriesFor(values.type)
  const previewAmount = Number(values.amount)

  const showError = (field) =>
    submitted || touched[field] ? errors[field] : undefined

  function update(field, value) {
    setValues((previous) => {
      const next = { ...previous, [field]: value }
      // Switching type invalidates the category, so clear it if it no longer fits.
      if (field === 'type' && !categoriesFor(value).some((c) => c.id === next.category)) {
        next.category = ''
      }
      return next
    })
  }

  function blur(field) {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (!isValid) {
      setStatus({ kind: 'error', message: 'Please fix the highlighted fields.' })
      return
    }

    onAdd({ ...values, amount: previewAmount })
    setValues(emptyForm(today))
    setTouched({})
    setSubmitted(false)
    setStatus({ kind: 'success', message: 'Transaction saved to this month.' })
  }

  return (
    <section className="panel" aria-labelledby="add-transaction-heading">
      <div className="panel__head">
        <h2 id="add-transaction-heading" className="panel__title">
          Add transaction
        </h2>
        <p className="panel__sub">Saved in Nepali Rupees (NPR)</p>
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="segment" role="group" aria-label="Transaction type">
          {['expense', 'income'].map((type) => (
            <button
              key={type}
              type="button"
              className={`segment__option segment__option--${type}${
                values.type === type ? ' is-active' : ''
              }`}
              aria-pressed={values.type === type}
              onClick={() => update('type', type)}
            >
              {type === 'expense' ? '− Expense' : '+ Income'}
            </button>
          ))}
        </div>
        {showError('type') ? (
          <p className="field__error" role="alert">
            {showError('type')}
          </p>
        ) : null}

        <Field label="Amount (NPR)" error={showError('amount')} htmlFor="amount">
          <div className="input-group">
            <span className="input-group__prefix">NPR</span>
            <input
              id="amount"
              name="amount"
              className="input input--amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={values.amount}
              onChange={(event) => update('amount', sanitiseAmountInput(event.target.value))}
              onBlur={() => blur('amount')}
            />
          </div>
          {values.amount && !errors.amount ? (
            <p className="field__live">{formatNPR(previewAmount)}</p>
          ) : null}
        </Field>

        <Field label="Category" error={showError('category')} htmlFor="category">
          <select
            id="category"
            name="category"
            className="input"
            value={values.category}
            onChange={(event) => update('category', event.target.value)}
            onBlur={() => blur('category')}
          >
            <option value="">Select a category…</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Description"
          error={showError('description')}
          hint={`${values.description.trim().length}/60`}
          htmlFor="description"
        >
          <input
            id="description"
            name="description"
            className="input"
            type="text"
            autoComplete="off"
            placeholder="e.g. Groceries at Asan"
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
            onBlur={() => blur('description')}
          />
        </Field>

        <Field
          label="Date"
          error={showError('date')}
          hint={formatDate(values.date)}
          htmlFor="calendar"
        >
          <Calendar
            id="calendar"
            value={values.date}
            maxDate={today}
            onChange={(iso) => update('date', iso)}
            invalid={Boolean(showError('date'))}
          />
        </Field>

        <button type="submit" className="btn-primary">
          Save transaction
        </button>

        {status ? (
          <p className={`form__status form__status--${status.kind}`} role="status">
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  )
}
