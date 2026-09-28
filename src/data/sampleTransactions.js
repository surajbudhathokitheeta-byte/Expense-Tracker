/**
 * A small demo data set, used by the "Load sample data" button so the app can
 * be explored (and screenshotted) without typing 14 transactions by hand.
 *
 * Dates are generated relative to the current month, so the summary cards and
 * the chart always have something to show no matter when the app is opened.
 */
import { toISODate } from '../utils/calendar.js'

const now = new Date()
const YEAR = now.getFullYear()
const MONTH = now.getMonth()
const DAYS_THIS_MONTH = new Date(YEAR, MONTH + 1, 0).getDate()
const DAYS_PREV_MONTH = new Date(YEAR, MONTH, 0).getDate()

/** day-of-month -> an ISO date inside the current month */
const thisMonth = (day) =>
  toISODate(new Date(YEAR, MONTH, Math.min(day, DAYS_THIS_MONTH)))

/** day-of-month -> an ISO date inside the previous month */
const lastMonth = (day) =>
  toISODate(new Date(YEAR, MONTH - 1, Math.min(day, DAYS_PREV_MONTH)))

export const SAMPLE_TRANSACTIONS = [
  { type: 'income', amount: 85000, category: 'salary', description: 'Monthly salary credit', date: thisMonth(1) },
  { type: 'expense', amount: 24000, category: 'housing', description: 'Room rent', date: thisMonth(2) },
  { type: 'expense', amount: 1850, category: 'food', description: 'Dal bhat at mess', date: thisMonth(3) },
  { type: 'expense', amount: 3200, category: 'housing', description: 'Electricity and internet', date: thisMonth(4) },
  { type: 'expense', amount: 1450, category: 'transport', description: 'Bus and local fare', date: thisMonth(5) },
  { type: 'income', amount: 12000, category: 'freelance', description: 'Landing page project', date: thisMonth(7) },
  { type: 'expense', amount: 2750, category: 'food', description: 'Weekly groceries', date: thisMonth(8) },
  { type: 'expense', amount: 4600, category: 'education', description: 'Course fee instalment', date: thisMonth(9) },
  { type: 'expense', amount: 980, category: 'health', description: 'Pharmacy and check-up', date: thisMonth(11) },
  { type: 'income', amount: 5000, category: 'other-income', description: 'Birthday gift from cousin', date: thisMonth(14) },
  { type: 'expense', amount: 3350, category: 'shopping', description: 'Winter jacket', date: thisMonth(16) },
  { type: 'expense', amount: 1500, category: 'other-expense', description: 'Movie and snacks', date: thisMonth(18) },
  { type: 'expense', amount: 6400, category: 'travel', description: 'Pokhara bus ticket', date: thisMonth(20) },
  { type: 'income', amount: 300, category: 'other-income', description: 'Savings interest', date: lastMonth(28) },
  { type: 'expense', amount: 22000, category: 'housing', description: 'Room rent', date: lastMonth(2) },
  { type: 'expense', amount: 2100, category: 'food', description: 'Groceries and eating out', date: lastMonth(9) },
  { type: 'expense', amount: 1250, category: 'other-expense', description: 'Gift for friend birthday', date: lastMonth(15) },
]
