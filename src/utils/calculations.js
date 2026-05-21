// Financial calculation utilities

/**
 * Computes total net savings.
 * Formula: startingBalance + totalAllowanceReceived - totalExpenses
 */
export function computeNetSavings({ startingBalance, totalAllowanceReceived, totalExpenses }) {
  return (
    Number(startingBalance) +
    Number(totalAllowanceReceived) -
    Number(totalExpenses)
  )
}

/**
 * Sums all allowance transactions (type === 'allowance').
 */
export function computeTotalAllowanceReceived(transactions) {
  return transactions
    .filter(tx => tx.type === 'allowance')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}

/**
 * Sums all expense transactions (type === 'expense').
 */
export function computeTotalExpenses(transactions) {
  return transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}

/**
 * Sums expense transactions in the current week (Monday–Sunday).
 */
export function computeWeeklySpent(transactions, weekStart, weekEnd) {
  return transactions
    .filter((tx) => {
      if (tx.type !== 'expense') return false
      const d = new Date(tx.date)
      return d >= weekStart && d <= weekEnd
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
}

/**
 * Returns a spending status based on percentage of limit used.
 */
export function getSpendStatus(spent, limit) {
  if (limit <= 0) return 'safe'
  const pct = spent / limit
  if (pct >= 1) return 'danger'
  if (pct >= 0.8) return 'warning'
  return 'safe'
}

/**
 * Formats a number as Philippine Peso.
 */
export function formatPHP(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
