import React, { useState, useMemo, useRef } from 'react'
import { Settings, PlusCircle, Wallet, Eye, EyeOff, Target, Clock, LayoutGrid, DollarSign, BarChart2 } from 'lucide-react'
import { WalletSection, TransactionFeed } from './Cards'
import QuickLogBar from './QuickLogBar'
import SettingsDialog from './SettingsDialog'
import AnalyticsDialog from './AnalyticsDialog'
import NetWorthManager, { AccountIcon } from './NetWorthManager'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatPHP, getSpendStatus, computeWeeklySpent } from '../utils/calculations'
import { getThisWeekStart, getThisWeekEnd } from '../utils/dateUtils'
import { computeNetWorth, computeTotalNetWorth, getAccountPreset } from '../utils/accounts'

export default function Dashboard({ settings, transactions, accounts, onUpdateSettings, onAddTransaction, onDeleteTransaction, onUpdateAccounts, onReset }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [accountsOpen, setAccountsOpen] = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [showAllowanceModal, setShowAllowanceModal] = useState(false)
  const [allowanceAmount, setAllowanceAmount] = useState(String(settings.weeklyAllowance))
  const [allowanceNote, setAllowanceNote] = useState('')
  const [allowanceAccountId, setAllowanceAccountId] = useState('')
  const [allowanceError, setAllowanceError] = useState('')
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  const historyRef = useRef(null)

  const allCategories = [...DEFAULT_CATEGORIES, ...(settings.customCategories || [])]

  // Computed values

  const weekStart = useMemo(() => getThisWeekStart(), [])
  const weekEnd = useMemo(() => getThisWeekEnd(), [])
  const weeklySpent = useMemo(() => computeWeeklySpent(transactions, weekStart, weekEnd), [transactions, weekStart, weekEnd])
  const limit = Number(settings.weeklySpendLimit)
  const spendPct = limit > 0 ? Math.min((weeklySpent / limit) * 100, 100) : 0
  const spendStatus = getSpendStatus(weeklySpent, limit)

  const netWorth = useMemo(() => computeNetWorth(accounts), [accounts])
  const totalNetWorth = useMemo(() => computeTotalNetWorth(accounts), [accounts])

  const handleAddExpense = ({ amount, category, note, accountId }) => {
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      type: 'expense',
      amount,
      category,
      note,
      accountId: accountId || null,
      date: new Date().toISOString(),
    })
    // Deduct from selected account
    if (accountId) {
      onUpdateAccounts(accounts.map(a =>
        a.id === accountId ? { ...a, balance: Math.max(0, a.balance - amount) } : a
      ))
    }
  }

  const handleAddAllowance = () => {
    const num = parseFloat(allowanceAmount)
    if (!allowanceAmount || isNaN(num) || num <= 0) {
      setAllowanceError('Enter a valid amount')
      return
    }
    if (accounts.length > 0 && !allowanceAccountId) {
      setAllowanceError('Select an account')
      return
    }
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      type: 'allowance',
      amount: num,
      note: allowanceNote.trim(),
      accountId: allowanceAccountId || null,
      date: new Date().toISOString(),
    })
    // Add to selected account
    if (allowanceAccountId) {
      onUpdateAccounts(accounts.map(a =>
        a.id === allowanceAccountId ? { ...a, balance: a.balance + num } : a
      ))
    }
    setShowAllowanceModal(false)
    setAllowanceAmount(String(settings.weeklyAllowance))
    setAllowanceNote('')
    setAllowanceAccountId('')
    setAllowanceError('')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION (Dark)
         ══════════════════════════════════════════════════════════ */}
      <div className="hero-section" style={{
        padding: '1.25rem 1.25rem 1.5rem',
        borderRadius: '0 0 1.75rem 1.75rem',
      }}>
        {/* Inner constraint wrapper */}
        <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>

        {/* Greeting Header */}
        <header className="animate-fade-up" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 12px rgba(129,140,248,0.3)',
            }}>👋</div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>
                Hi there!
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--hero-muted)' }}>
                Track your finances
              </div>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            title="Settings"
          >
            <Settings size={18} color="var(--hero-muted)" />
          </button>
        </header>

        {/* Balance Hero */}
        <div className="animate-fade-up stagger-1" style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--hero-muted)', fontWeight: 500, marginBottom: '0.3rem' }}>
            Spendable Net Worth
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontSize: '2.2rem', fontWeight: 800, color: '#f1f5f9',
              letterSpacing: '-1px',
            }}>
              {balanceVisible ? formatPHP(netWorth) : '₱ ••••••'}
            </span>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderRadius: '50%', width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {balanceVisible
                ? <Eye size={14} color="var(--hero-muted)" />
                : <EyeOff size={14} color="var(--hero-muted)" />}
            </button>
          </div>
        </div>

        {/* Spending Limit Bar */}
        <div className="animate-fade-up stagger-2" style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '0.875rem',
          padding: '0.875rem 1rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--hero-muted)', fontWeight: 500 }}>
              Weekly Limit
            </span>
            <span style={{ fontSize: '0.78rem', color: '#f1f5f9', fontWeight: 700 }}>
              {formatPHP(limit)}
            </span>
          </div>
          <div className="progress-bar" style={{ marginBottom: '0.35rem' }}>
            <div className={`progress-fill ${spendStatus}`} style={{ width: `${spendPct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--hero-muted)' }}>
              Spent {formatPHP(weeklySpent)}
            </span>
            <span style={{
              fontSize: '0.68rem', fontWeight: 600,
              color: spendStatus === 'danger' ? '#f87171' : spendStatus === 'warning' ? '#fbbf24' : '#4ade80',
            }}>
              {weeklySpent > limit ? `${formatPHP(weeklySpent - limit)} over` : `${formatPHP(limit - weeklySpent)} left`}
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="animate-fade-up stagger-2" style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '0 0.25rem',
        }}>
          <button className="action-btn" onClick={() => { setShowAllowanceModal(true); setAllowanceAmount(String(settings.weeklyAllowance)) }}>
            <div className="action-icon">
              <PlusCircle size={22} color="#a5b4fc" />
            </div>
            <span className="action-label">Add Money</span>
          </button>

          <button className="action-btn" onClick={() => setAccountsOpen(true)}>
            <div className="action-icon">
              <DollarSign size={22} color="#a5b4fc" />
            </div>
            <span className="action-label">Accounts</span>
          </button>

          <button className="action-btn" onClick={() => setAnalyticsOpen(true)}>
            <div className="action-icon">
              <BarChart2 size={22} color="#a5b4fc" />
            </div>
            <span className="action-label">Analytics</span>
          </button>

          <button className="action-btn" onClick={() => historyRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="action-icon">
              <Clock size={22} color="#a5b4fc" />
            </div>
            <span className="action-label">History</span>
          </button>

          <button className="action-btn" onClick={() => setSettingsOpen(true)}>
            <div className="action-icon">
              <LayoutGrid size={22} color="#a5b4fc" />
            </div>
            <span className="action-label">More</span>
          </button>
        </div>

        </div>{/* end inner constraint */}
      </div>

      {/* ══════════════════════════════════════════════════════════
          LIGHT CONTENT SECTION
         ══════════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1,
        padding: '1.25rem',
        paddingBottom: '6.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Wallet Section */}
        <div>
          <div className="section-header">
            <h2>Wallet</h2>
          </div>
          <WalletSection transactions={transactions} />
        </div>

        {/* My Accounts Section */}
        {accounts.length > 0 && (
          <div className="animate-fade-up stagger-4">
            <div className="section-header">
              <h2>My Accounts</h2>
              <button className="see-all" onClick={() => setAccountsOpen(true)}>
                Manage
              </button>
            </div>
            <div className="card" style={{ padding: '0.25rem' }}>
              {accounts.map((acc, i) => (
                <div
                  key={acc.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 0.875rem',
                    borderBottom: i < accounts.length - 1 ? '1px solid var(--border-color)' : 'none',
                  }}
                >
                  <AccountIcon name={acc.presetId || acc.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {acc.name}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {balanceVisible ? formatPHP(acc.balance) : '₱ ••••'}
                  </span>
                </div>
              ))}
              {/* Total row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 0.875rem',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                borderRadius: '0 0 0.875rem 0.875rem',
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Total Net Worth
                </span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent)' }}>
                  {balanceVisible ? formatPHP(totalNetWorth) : '₱ ••••••'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* No Accounts Prompt */}
        {accounts.length === 0 && (
          <div className="animate-fade-up stagger-4">
            <div className="section-header">
              <h2>My Accounts</h2>
            </div>
            <button
              onClick={() => setAccountsOpen(true)}
              className="card"
              style={{
                width: '100%', padding: '1.5rem', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.5rem', border: '2px dashed var(--border-color)',
                background: 'var(--bg-card)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--accent-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlusCircle size={22} color="var(--accent)" />
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Add your accounts
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                GCash, Maya, BPI, Cash, and more
              </p>
            </button>
          </div>
        )}


        {/* Transaction History */}
        <div ref={historyRef}>
          <div className="section-header">
            <h2>Latest Transactions</h2>
            {transactions.length > 5 && (
              <button className="see-all" onClick={() => setShowAllTransactions(!showAllTransactions)}>
                {showAllTransactions ? 'Show Less' : 'See All'}
              </button>
            )}
          </div>
          <TransactionFeed
            transactions={transactions}
            onDelete={onDeleteTransaction}
            limit={showAllTransactions ? undefined : 5}
          />
        </div>
      </main>

      {/* ── Fixed Bottom Bar ── */}
      <QuickLogBar allCategories={allCategories} accounts={accounts} onAdd={handleAddExpense} />

      {/* ── Allowance Modal ── */}
      {showAllowanceModal && (
        <div
          className="dialog-overlay"
          onClick={() => { setShowAllowanceModal(false); setAllowanceError('') }}
        >
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--green-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>💰</div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Log Allowance</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  How much did you receive?
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Amount
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem',
                }}>₱</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="app-input"
                  style={{ paddingLeft: '2rem', fontSize: '1.1rem', fontWeight: 700 }}
                  value={allowanceAmount}
                  autoFocus
                  onChange={e => { setAllowanceAmount(e.target.value); setAllowanceError('') }}
                />
              </div>
              {allowanceError && (
                <p style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: '0.3rem' }}>⚠ {allowanceError}</p>
              )}
            </div>

            {/* Account selector for allowance */}
            {accounts.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Add to account
                </label>
                <select
                  className="app-input"
                  style={{ appearance: 'none', cursor: 'pointer' }}
                  value={allowanceAccountId}
                  onChange={e => setAllowanceAccountId(e.target.value)}
                >
                  <option value="">Select account…</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Note (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. from mom, this week's allowance…"
                className="app-input"
                value={allowanceNote}
                maxLength={80}
                onChange={e => setAllowanceNote(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddAllowance}
              className="btn-primary"
              style={{
                marginBottom: '0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
              }}
            >
              💰 Add to My Savings
            </button>
            <button
              className="btn-ghost"
              onClick={() => { setShowAllowanceModal(false); setAllowanceError('') }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Settings Dialog ── */}
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={onUpdateSettings}
        onReset={onReset}
      />

      {/* ── Net Worth Manager ── */}
      <NetWorthManager
        isOpen={accountsOpen}
        onClose={() => setAccountsOpen(false)}
        accounts={accounts}
        onUpdateAccounts={onUpdateAccounts}
      />

      {/* ── Analytics Dialog ── */}
      <AnalyticsDialog
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        transactions={transactions}
        weeklyLimit={limit}
      />
    </div>
  )
}
