import React, { useMemo } from 'react'
import { BarChart2, X } from 'lucide-react'
import { computeWeeklyAnalytics, formatPHP } from '../utils/calculations'
import { formatDate } from '../utils/dateUtils'

export default function AnalyticsDialog({ isOpen, onClose, transactions, weeklyLimit }) {
  const analytics = useMemo(() => computeWeeklyAnalytics(transactions), [transactions])

  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()} style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '0.625rem',
              background: 'var(--accent-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={17} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analytics</h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-input)', border: '1px solid var(--border-color)',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={15} color="var(--text-secondary)" />
          </button>
        </div>

        <p style={{
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
          marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Weekly Performance
        </p>

        {analytics.length === 0 ? (
          <div style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            borderRadius: '0.875rem', padding: '2rem 1rem', textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No spending history yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analytics.map((week, idx) => {
              const isOver = week.totalSpent > weeklyLimit
              const diff = Math.abs(weeklyLimit - week.totalSpent)
              const pct = weeklyLimit > 0 ? Math.min((week.totalSpent / weeklyLimit) * 100, 100) : 0
              
              return (
                <div key={idx} style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                  borderRadius: '0.875rem', padding: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatDate(week.weekStart.toISOString())} - {formatDate(week.weekEnd.toISOString())}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOver ? 'var(--red)' : 'var(--green)' }}>
                      {formatPHP(week.totalSpent)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    width: '100%', height: '6px', borderRadius: '3px',
                    background: 'var(--border-color)', overflow: 'hidden',
                    marginBottom: '0.5rem',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: isOver ? 'var(--red)' : 'var(--green)',
                      borderRadius: '3px', transition: 'width 0.3s ease',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Limit: {formatPHP(weeklyLimit)}</span>
                    <span style={{ color: isOver ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
                      {isOver ? `${formatPHP(diff)} over` : `${formatPHP(diff)} left`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
