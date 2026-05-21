// Category definitions with icons (emoji) and colors

export const DEFAULT_CATEGORIES = ['Food', 'Commute', 'School', 'Games', 'Misc']

export const CATEGORY_META = {
  Food:    { emoji: '🍜', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  Commute: { emoji: '🚌', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  School:  { emoji: '📚', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  Games:   { emoji: '🎮', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  Misc:    { emoji: '📦', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
}

export function getCategoryMeta(category) {
  return (
    CATEGORY_META[category] || { emoji: '💸', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
  )
}
