import React, { useState } from 'react'
import { PlusCircle, ChevronDown } from 'lucide-react'
import { getCategoryMeta } from '../utils/categories'

export default function QuickLogBar({ allCategories, onAdd }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(allCategories[0] || 'Food')
  const [note, setNote] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid amount')
      return
    }
    onAdd({ amount: num, category, note: note.trim() })
    setAmount('')
    setNote('')
    setError('')
    setIsOpen(false)
  }

  const meta = getCategoryMeta(category)

  return (
    <div className="bottom-bar">
      {/* Collapsed trigger row */}
      {!isOpen && (
        <div style={{ padding: '0.75rem 1rem' }}>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '0.875rem',
              padding: '0.8rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '0.625rem',
              background: 'rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PlusCircle size={19} color="#10b981" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Log an expense
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Tap to add a new transaction
              </div>
            </div>
            <ChevronDown size={18} color="var(--text-secondary)" />
          </button>
        </div>
      )}

      {/* Expanded form */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Log Expense</span>
            <button
              type="button"
              onClick={() => { setIsOpen(false); setError('') }}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)',
                borderRadius: '0.5rem', padding: '4px 10px', cursor: 'pointer',
                fontSize: '0.75rem', color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
          </div>

          {/* Amount + Category row */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
            {/* Amount */}
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', zIndex: 1,
              }}>₱</span>
              <input
                type="text" inputMode="decimal" placeholder="0.00"
                className="app-input"
                style={{ paddingLeft: '1.75rem', fontSize: '1rem', fontWeight: 700 }}
                value={amount}
                onChange={e => { setAmount(e.target.value); setError('') }}
                autoFocus
              />
            </div>

            {/* Category select */}
            <div style={{ position: 'relative', minWidth: 130 }}>
              <div style={{
                position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', zIndex: 1, pointerEvents: 'none',
              }}>
                {meta.emoji}
              </div>
              <select
                className="app-input"
                style={{ paddingLeft: '2rem', appearance: 'none', cursor: 'pointer' }}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: '0.75rem' }}>
            <input
              type="text" placeholder="Note (optional)"
              className="app-input"
              style={{ fontSize: '0.875rem' }}
              value={note}
              maxLength={80}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.75rem', color: '#fb7185', marginBottom: '0.5rem' }}>⚠ {error}</p>
          )}

          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <PlusCircle size={17} />
            Add Expense
          </button>
        </form>
      )}
    </div>
  )
}
