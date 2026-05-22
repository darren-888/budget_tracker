import React, { useState } from 'react'
import { Settings, Wallet, PlusCircle } from 'lucide-react'
import { NetSavingsCard, WeeklySpendingCard, TransactionFeed } from './Cards'
import QuickLogBar from './QuickLogBar'
import SettingsDialog from './SettingsDialog'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatPHP } from '../utils/calculations'

export default function Dashboard({ settings, transactions, onUpdateSettings, onAddTransaction, onDeleteTransaction, onReset }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAllowanceModal, setShowAllowanceModal] = useState(false)
  const [allowanceAmount, setAllowanceAmount] = useState(String(settings.weeklyAllowance))
  const [allowanceNote, setAllowanceNote] = useState('')
  const [allowanceError, setAllowanceError] = useState('')

  const allCategories = [...DEFAULT_CATEGORIES, ...(settings.customCategories || [])]

  const handleAddExpense = ({ amount, category, note }) => {
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      type: 'expense',
      amount,
      category,
      note,
      date: new Date().toISOString(),
    })
  }

  const handleAddAllowance = () => {
    const num = parseFloat(allowanceAmount)
    if (!allowanceAmount || isNaN(num) || num <= 0) {
      setAllowanceError('Enter a valid amount')
      return
    }
    onAddTransaction({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      type: 'allowance',
      amount: num,
      note: allowanceNote.trim(),
      date: new Date().toISOString(),
    })
    setShowAllowanceModal(false)
    setAllowanceAmount(String(settings.weeklyAllowance))
    setAllowanceNote('')
    setAllowanceError('')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      background: 'linear-gradient(180deg, #020617 0%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1rem 0.75rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(2,6,23,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '0.625rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(16,185,129,0.3)',
          }}>
            <Wallet size={18} color="#fff" />
          </div>
          <div>
            <div className="gradient-text" style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.1 }}>
              Budget Tracker
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              Personal Finance
            </div>
          </div>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
            borderRadius: '0.625rem', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          title="Settings"
        >
          <Settings size={17} color="var(--text-secondary)" />
        </button>
      </header>

      {/* ── Scrollable Content ── */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        paddingBottom: '6.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
      }}>
        <NetSavingsCard settings={settings} transactions={transactions} />

        {/* Got Allowance Button */}
        <button
          onClick={() => { setShowAllowanceModal(true); setAllowanceAmount(String(settings.weeklyAllowance)) }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.08))',
            border: '1px dashed rgba(52,211,153,0.4)',
            borderRadius: '0.875rem',
            padding: '0.875rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.08))'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)' }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: '0.625rem',
            background: 'rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>💰</div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399' }}>
              Got my allowance! 💸
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Tap to record {formatPHP(settings.weeklyAllowance)} (or any amount)
            </div>
          </div>
          <PlusCircle size={20} color="#34d399" />
        </button>

        <WeeklySpendingCard settings={settings} transactions={transactions} />

        {/* History section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Transaction History
            </h2>
            <span style={{
              fontSize: '0.7rem', color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '999px', padding: '2px 8px',
            }}>
              {transactions.length} total
            </span>
          </div>
          <TransactionFeed transactions={transactions} onDelete={onDeleteTransaction} />
        </div>
      </main>

      {/* ── Fixed Bottom Bar ── */}
      <QuickLogBar allCategories={allCategories} onAdd={handleAddExpense} />

      {/* ── Allowance Modal ── */}
      {showAllowanceModal && (
        <div
          className="dialog-overlay"
          onClick={() => { setShowAllowanceModal(false); setAllowanceError('') }}
        >
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>💰</span>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Log Allowance Received</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  How much did you receive today?
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
                <p style={{ fontSize: '0.72rem', color: '#fb7185', marginTop: '0.3rem' }}>⚠ {allowanceError}</p>
              )}
            </div>

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
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontWeight: 700, border: 'none',
                borderRadius: '0.625rem', padding: '0.8rem',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem',
                marginBottom: '0.6rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
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
    </div>
  )
}
