import React, { useMemo } from 'react'
import { formatPHP, computeTotalAllowanceReceived, computeTotalExpenses, computeWeeklySpent } from '../utils/calculations'
import { getDaysRemainingInWeek, formatDate, formatDateTime, getThisWeekStart, getThisWeekEnd } from '../utils/dateUtils'
import { getCategoryMeta } from '../utils/categories'
import { TrendingUp, TrendingDown, Calendar, Trash2, ShoppingBag, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

// ─── Wallet Summary Cards (Income / Spending) ─────────────────────────────────
export function WalletSection({ transactions }) {
  const totalIncome = useMemo(() => computeTotalAllowanceReceived(transactions), [transactions])
  const totalExpenses = useMemo(() => computeTotalExpenses(transactions), [transactions])

  return (
    <div className="wallet-grid animate-fade-up stagger-3">
      <div className="wallet-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="wallet-icon" style={{ background: 'var(--green-bg)' }}>
            <ArrowDownLeft size={18} color="var(--green)" />
          </div>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--border-color)',
            cursor: 'pointer',
            boxShadow: '10px 0 0 var(--border-color), 20px 0 0 var(--border-color)',
          }} />
        </div>
        <div>
          <p className="wallet-label">Income</p>
          <p className="wallet-amount" style={{ color: 'var(--green)' }}>{formatPHP(totalIncome)}</p>
        </div>
      </div>

      <div className="wallet-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="wallet-icon" style={{ background: 'var(--red-bg)' }}>
            <ArrowUpRight size={18} color="var(--red)" />
          </div>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--border-color)',
            cursor: 'pointer',
            boxShadow: '10px 0 0 var(--border-color), 20px 0 0 var(--border-color)',
          }} />
        </div>
        <div>
          <p className="wallet-label">Spending</p>
          <p className="wallet-amount" style={{ color: 'var(--red)' }}>{formatPHP(totalExpenses)}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Weekly Spending Card ──────────────────────────────────────────────────────
export function WeeklySpendingCard({ settings, transactions }) {
  const weekStart = useMemo(() => getThisWeekStart(), [])
  const weekEnd = useMemo(() => getThisWeekEnd(), [])
  const weeklySpent = useMemo(
    () => computeWeeklySpent(transactions, weekStart, weekEnd),
    [transactions, weekStart, weekEnd]
  )
  const daysRemaining = useMemo(() => getDaysRemainingInWeek(), [])
  const limit = Number(settings.weeklySpendLimit)
  const pct = limit > 0 ? Math.min((weeklySpent / limit) * 100, 100) : 0
  const overBudget = weeklySpent > limit

  return (
    <div className="card animate-fade-up stagger-4" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '0.5rem',
            background: overBudget ? 'var(--red-bg)' : 'var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={17} color={overBudget ? 'var(--red)' : 'var(--accent)'} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
            This Week's Budget
          </span>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600,
          color: overBudget ? 'var(--red)' : 'var(--green)',
          background: overBudget ? 'var(--red-bg)' : 'var(--green-bg)',
          padding: '3px 10px', borderRadius: '999px',
        }}>
          {overBudget ? 'Over budget' : 'On track'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {formatPHP(weeklySpent)}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          / {formatPHP(limit)}
        </span>
      </div>

      <div className="progress-bar light" style={{ marginBottom: '0.6rem' }}>
        <div className={`progress-fill ${overBudget ? 'danger' : pct > 80 ? 'warning' : 'safe'}`} style={{ width: `${pct}%` }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} />
          {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
        </span>
        {overBudget ? (
          <span style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600 }}>
            {formatPHP(weeklySpent - limit)} over
          </span>
        ) : (
          <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 600 }}>
            {formatPHP(limit - weeklySpent)} remaining
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Transaction Feed ─────────────────────────────────────────────────────────
export function TransactionFeed({ transactions, onDelete, limit }) {
  if (transactions.length === 0) {
    return (
      <div className="animate-fade-up" style={{
        textAlign: 'center', padding: '2.5rem 1rem',
        color: 'var(--text-secondary)',
      }}>
        <ShoppingBag size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.25 }} />
        <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No transactions yet</p>
        <p style={{ fontSize: '0.8rem' }}>Start by logging an expense or allowance</p>
      </div>
    )
  }

  const sorted = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const display = limit ? sorted.slice(0, limit) : sorted

  const grouped = display.reduce((acc, tx) => {
    const label = formatDate(tx.date)
    if (!acc[label]) acc[label] = []
    acc[label].push(tx)
    return acc
  }, {})

  return (
    <div className="animate-fade-up stagger-5" style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(grouped).map(([dateLabel, txs]) => (
        <div key={dateLabel}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '0.6rem 0 0.4rem',
          }}>
            {dateLabel}
          </div>
          {txs.map((tx, i) => (
            tx.type === 'allowance'
              ? <AllowanceRow key={tx.id} tx={tx} onDelete={onDelete} delay={i * 0.04} />
              : <TransactionRow key={tx.id} tx={tx} onDelete={onDelete} delay={i * 0.04} />
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
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem',
        borderRadius: '0.875rem',
        marginBottom: '0.375rem',
        background: 'var(--green-bg)',
        border: '1px solid rgba(34,197,94,0.15)',
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(34,197,94,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.15rem',
      }}>💰</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--green)' }}>
          Allowance Received
        </div>
        {tx.note && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tx.note}
          </p>
        )}
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {formatDateTime(tx.date)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--green)' }}>
          +{formatPHP(tx.amount)}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          style={{
            background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
          }}
          title="Remove"
        >
          <Trash2 size={12} color="var(--red)" />
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
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem',
        borderRadius: '0.875rem',
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
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: meta.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.15rem',
      }}>
        {meta.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          {tx.category}
        </div>
        {tx.note && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tx.note}
          </p>
        )}
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {formatDateTime(tx.date)}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--red)' }}>
          -{formatPHP(tx.amount)}
        </span>
        <button
          onClick={() => onDelete(tx.id)}
          style={{
            background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--red-bg)'}
          title="Delete"
        >
          <Trash2 size={12} color="var(--red)" />
        </button>
      </div>
    </div>
  )
}
