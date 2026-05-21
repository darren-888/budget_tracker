import React, { useMemo } from 'react'
import { formatPHP, getSpendStatus, computeNetSavings, computeTotalAllowanceReceived, computeTotalExpenses, computeWeeklySpent } from '../utils/calculations'
import { getDaysRemainingInWeek, formatDate, formatDateTime, getThisWeekStart, getThisWeekEnd } from '../utils/dateUtils'
import { getCategoryMeta } from '../utils/categories'
import { Wallet, TrendingUp, Calendar, Trash2, ShoppingBag, ArrowDownLeft } from 'lucide-react'

// ─── Net Savings Card ─────────────────────────────────────────────────────────
export function NetSavingsCard({ settings, transactions }) {
  const totalAllowanceReceived = useMemo(() => computeTotalAllowanceReceived(transactions), [transactions])
  const totalExpenses          = useMemo(() => computeTotalExpenses(transactions), [transactions])
  const netSavings = useMemo(
    () => computeNetSavings({ startingBalance: settings.startingBalance, totalAllowanceReceived, totalExpenses }),
    [settings.startingBalance, totalAllowanceReceived, totalExpenses]
  )
  const allowanceCount = useMemo(() => transactions.filter(tx => tx.type === 'allowance').length, [transactions])
  const isPositive = netSavings >= 0

  return (
    <div
      className="glass-card animate-fade-up stagger-1"
      style={{
        padding: '1.25rem 1.375rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(15,23,42,0.9) 60%)',
        borderColor: 'rgba(16,185,129,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 120, height: 120,
        borderRadius: '50%', background: 'rgba(16,185,129,0.08)', pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '0.5rem',
          background: 'rgba(16,185,129,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Wallet size={17} color="#10b981" />
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
          Total Net Savings
        </span>
      </div>

      <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
        {formatPHP(netSavings)}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Chip label={`${formatPHP(settings.startingBalance)} start`} color="var(--text-secondary)" />
        <Chip label={`+${formatPHP(totalAllowanceReceived)} received`} color="#34d399" />
        <Chip label={`-${formatPHP(totalExpenses)} spent`} color="#fb7185" />
        {allowanceCount === 0 && (
          <Chip label="Log allowance ↓" color="#f59e0b" />
        )}
      </div>
    </div>
  )
}

function Chip({ label, color }) {
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 500, color,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '999px', padding: '2px 8px',
    }}>
      {label}
    </span>
  )
}

// ─── Weekly Spending Card ──────────────────────────────────────────────────────
export function WeeklySpendingCard({ settings, transactions }) {
  const weekStart = useMemo(() => getThisWeekStart(), [])
  const weekEnd   = useMemo(() => getThisWeekEnd(), [])
  const weeklySpent = useMemo(
    () => computeWeeklySpent(transactions, weekStart, weekEnd),
    [transactions, weekStart, weekEnd]
  )
  const daysRemaining = useMemo(() => getDaysRemainingInWeek(), [])
  const limit = Number(settings.weeklySpendLimit)
  const pct = limit > 0 ? Math.min((weeklySpent / limit) * 100, 100) : 0
  const status = getSpendStatus(weeklySpent, limit)
  const overBudget = weeklySpent > limit

  const statusColor = { safe: '#10b981', warning: '#f59e0b', danger: '#f43f5e' }[status]
  const statusLabel = { safe: 'On track 🟢', warning: 'Watch out ⚠️', danger: 'Over budget 🔴' }[status]

  return (
    <div className="glass-card animate-fade-up stagger-2" style={{ padding: '1.25rem 1.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '0.5rem',
            background: `rgba(${status === 'safe' ? '16,185,129' : status === 'warning' ? '245,158,11' : '244,63,94'},0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={17} color={statusColor} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
            This Week's Spending
          </span>
        </div>
        <span style={{
          fontSize: '0.72rem', color: statusColor, fontWeight: 600,
          background: `rgba(${status === 'safe' ? '16,185,129' : status === 'warning' ? '245,158,11' : '244,63,94'},0.1)`,
          padding: '2px 8px', borderRadius: '999px',
        }}>
          {statusLabel}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: statusColor }}>
          {formatPHP(weeklySpent)}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          / {formatPHP(limit)}
        </span>
      </div>

      <div className="progress-bar" style={{ marginBottom: '0.6rem' }}>
        <div className={`progress-fill ${status}`} style={{ width: `${pct}%` }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} />
          {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left this week
        </span>
        {overBudget ? (
          <span style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 600 }}>
            {formatPHP(weeklySpent - limit)} over limit
          </span>
        ) : (
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {formatPHP(limit - weeklySpent)} remaining
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Transaction Feed ─────────────────────────────────────────────────────────
export function TransactionFeed({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="animate-fade-up stagger-3" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
        <ShoppingBag size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No transactions yet</p>
        <p style={{ fontSize: '0.8rem' }}>Log allowance or expenses below ↓</p>
      </div>
    )
  }

  const grouped = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reduce((acc, tx) => {
      const label = formatDate(tx.date)
      if (!acc[label]) acc[label] = []
      acc[label].push(tx)
      return acc
    }, {})

  return (
    <div className="animate-fade-up stagger-3" style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(grouped).map(([dateLabel, txs]) => (
        <div key={dateLabel}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '0.6rem 0 0.4rem',
          }}>
            {dateLabel}
          </div>
          {txs.map((tx, i) => (
            tx.type === 'allowance'
              ? <AllowanceRow key={tx.id} tx={tx} onDelete={onDelete} delay={i * 0.05} />
              : <TransactionRow key={tx.id} tx={tx} onDelete={onDelete} delay={i * 0.05} />
          ))}
        </div>
      ))}
    </div>
  )
}

function AllowanceRow({ tx, onDelete, delay }) {
  return (
    <div
      className="animate-scale-in"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.75rem 0.875rem',
        borderRadius: '0.75rem',
        marginBottom: '0.375rem',
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.2)',
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '0.625rem', flexShrink: 0,
        background: 'rgba(16,185,129,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>
        💰
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#34d399' }}>
          Allowance Received
        </div>
        {tx.note && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tx.note}
          </p>
        )}
        <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {formatDateTime(tx.date)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#34d399' }}>
          +{formatPHP(tx.amount)}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          style={{
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '0.5rem', width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
          }}
          title="Remove allowance entry"
        >
          <Trash2 size={13} color="#f43f5e" />
        </button>
      </div>
    </div>
  )
}

function TransactionRow({ tx, onDelete, delay }) {
  const meta = getCategoryMeta(tx.category)
  return (
    <div
      className="animate-scale-in"
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.75rem 0.875rem',
        borderRadius: '0.75rem',
        marginBottom: '0.375rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        animationDelay: `${delay}s`,
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '0.625rem', flexShrink: 0,
        background: meta.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>
        {meta.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
          {tx.category}
        </div>
        {tx.note && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tx.note}
          </p>
        )}
        <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {formatDateTime(tx.date)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fb7185' }}>
          -{formatPHP(tx.amount)}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          style={{
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '0.5rem', width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
          title="Delete transaction"
        >
          <Trash2 size={13} color="#f43f5e" />
        </button>
      </div>
    </div>
  )
}
