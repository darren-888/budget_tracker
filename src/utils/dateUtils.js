// Date and week utility functions

/**
 * Returns the Monday of the week containing the given date.
 */
export function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun, 1=Mon...
  const diff = (day === 0 ? -6 : 1 - day) // adjust to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Returns how many full weeks (Monday→Monday) have elapsed
 * since setupDate, counting the setup week as week 1.
 */
export function getWeeksElapsed(setupDateStr) {
  if (!setupDateStr) return 1
  const setupMonday = getMondayOf(new Date(setupDateStr))
  const currentMonday = getMondayOf(new Date())
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeks = Math.floor((currentMonday - setupMonday) / msPerWeek) + 1
  return Math.max(1, weeks)
}

/**
 * Returns the Monday of the current week (start of week).
 */
export function getThisWeekStart() {
  return getMondayOf(new Date())
}

/**
 * Returns the Sunday of the current week (end of week, inclusive).
 */
export function getThisWeekEnd() {
  const monday = getMondayOf(new Date())
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return sunday
}

/**
 * Returns days remaining in the current week (Mon–Sun).
 */
export function getDaysRemainingInWeek() {
  const today = new Date()
  const sunday = getThisWeekEnd()
  const msRemaining = sunday - today
  return Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)))
}

/**
 * Formats a date string into a readable short form.
 * e.g. "May 21" or "Today" / "Yesterday"
 */
export function formatDate(isoString) {
  const date = new Date(isoString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

/**
 * Formats a full timestamp.
 */
export function formatDateTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('en-PH', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}
