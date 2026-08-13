// Account/source presets for the Net Worth tracker

export const ACCOUNT_PRESETS = [
  { id: 'gcash', name: 'GCash', letter: 'G', color: '#007bff' },
  { id: 'maya', name: 'Maya', letter: 'M', color: '#39b54a' },
  { id: 'maribank', name: 'MariBank', letter: 'MB', color: '#ff6b35' },
  { id: 'gotyme', name: 'GoTyme', letter: 'GT', color: '#6b21a8' },
  { id: 'bpi', name: 'BPI', letter: 'BPI', color: '#cc0000' },
  { id: 'bdo', name: 'BDO', letter: 'BDO', color: '#003d7c' },
  { id: 'unionbank', name: 'UnionBank', letter: 'UB', color: '#f47920' },
  { id: 'landbank', name: 'Landbank', letter: 'LB', color: '#006838' },
  { id: 'cash', name: 'Cash on Hand', letter: '₱', color: '#16a34a' },
  { id: 'stocks', name: 'Stocks', letter: 'ST', color: '#0ea5e9' },
  { id: 'crypto', name: 'Crypto', letter: '₿', color: '#f7931a' },
]

/**
 * Get preset metadata by preset id or name.
 * Falls back to a generic icon.
 */
export function getAccountPreset(nameOrId) {
  return (
    ACCOUNT_PRESETS.find(p => p.id === nameOrId || p.name === nameOrId) ||
    { id: 'custom', name: nameOrId, letter: nameOrId?.[0]?.toUpperCase() || '?', color: '#8b5cf6' }
  )
}

/**
 * Compute total net worth from an array of accounts.
 */
export function computeNetWorth(accounts) {
  return accounts.reduce((sum, acc) => {
    if (acc.excludeFromTotal) return sum
    return sum + Number(acc.balance || 0)
  }, 0)
}

/**
 * Compute absolute total net worth (including excluded accounts).
 */
export function computeTotalNetWorth(accounts) {
  return accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
}
