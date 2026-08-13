import React, { useState } from 'react'
import { X, Plus, Trash2, Pencil, Check, DollarSign, Eye, EyeOff } from 'lucide-react'
import { ACCOUNT_PRESETS, getAccountPreset, computeNetWorth } from '../utils/accounts'
import { formatPHP } from '../utils/calculations'

function AccountIcon({ name, size = 40, presetData }) {
  const preset = presetData || getAccountPreset(name)
  const fontSize = preset.letter.length > 2 ? size * 0.28 : preset.letter.length > 1 ? size * 0.32 : size * 0.42
  return (
    <div
      className="account-icon"
      style={{
        width: size, height: size,
        borderRadius: size * 0.25,
        background: preset.color,
        fontSize,
        boxShadow: `0 2px 8px ${preset.color}35`,
        letterSpacing: preset.letter.length > 2 ? '-0.5px' : 0,
      }}
    >
      {preset.letter}
    </div>
  )
}

export default function NetWorthManager({ isOpen, onClose, accounts, onUpdateAccounts }) {
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')
  const [showAddPreset, setShowAddPreset] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customBalance, setCustomBalance] = useState('')
  const [customColor, setCustomColor] = useState('#8b5cf6')
  const [addPresetBalance, setAddPresetBalance] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)

  if (!isOpen) return null

  const netWorth = computeNetWorth(accounts)

  // Presets not yet added
  const addedNames = accounts.map(a => a.presetId || a.name)
  const availablePresets = ACCOUNT_PRESETS.filter(p => !addedNames.includes(p.id) && !addedNames.includes(p.name))

  const handleAddPresetAccount = () => {
    if (!selectedPreset) return
    const bal = parseFloat(addPresetBalance) || 0
    if (bal < 0) return
    const newAcc = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      presetId: selectedPreset.id,
      name: selectedPreset.name,
      balance: bal,
      color: selectedPreset.color,
    }
    onUpdateAccounts([...accounts, newAcc])
    setSelectedPreset(null)
    setAddPresetBalance('')
    setShowAddPreset(false)
  }

  const handleAddCustom = () => {
    if (!customName.trim()) return
    const bal = parseFloat(customBalance) || 0
    if (bal < 0) return
    const newAcc = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: customName.trim(),
      balance: bal,
      color: customColor,
    }
    onUpdateAccounts([...accounts, newAcc])
    setCustomName('')
    setCustomBalance('')
    setShowCustomForm(false)
  }

  const handleDelete = (id) => {
    onUpdateAccounts(accounts.filter(a => a.id !== id))
  }

  const toggleExclude = (id, currentStatus) => {
    onUpdateAccounts(accounts.map(a => a.id === id ? { ...a, excludeFromTotal: !currentStatus } : a))
  }

  const startEdit = (acc) => {
    setEditingId(acc.id)
    setEditAmount(String(acc.balance))
  }

  const saveEdit = (id) => {
    const num = parseFloat(editAmount)
    if (isNaN(num) || num < 0) return
    onUpdateAccounts(accounts.map(a => a.id === id ? { ...a, balance: num } : a))
    setEditingId(null)
    setEditAmount('')
  }

  const customColors = ['#4f46e5', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#22c55e', '#0ea5e9', '#6b7280']

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
              <DollarSign size={18} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>My Accounts</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Track where your money lives
              </p>
            </div>
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

        {/* Net Worth Total */}
        <div style={{
          background: 'linear-gradient(135deg, var(--hero-start), var(--hero-end))',
          borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 100, height: 100,
            borderRadius: '50%', background: 'rgba(129,140,248,0.1)', pointerEvents: 'none',
          }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--hero-muted)', marginBottom: '0.3rem', fontWeight: 500 }}>
            Spendable Net Worth
          </p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>
            {formatPHP(netWorth)}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--hero-muted)', marginTop: '0.3rem' }}>
            Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Account List */}
        {accounts.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem',
            }}>
              Your Accounts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {accounts.map(acc => {
                const proportion = netWorth > 0 ? (acc.balance / netWorth) * 100 : 0
                return (
                  <div key={acc.id} className="animate-scale-in" style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                    borderRadius: '0.875rem', padding: '0.875rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <AccountIcon name={acc.presetId || acc.name} size={38} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: acc.excludeFromTotal ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                          {acc.name}
                        </p>
                        {editingId === acc.id ? (
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <span style={{
                                position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--accent)', fontWeight: 700, fontSize: '0.75rem',
                              }}>₱</span>
                              <input
                                type="text" inputMode="decimal"
                                className="app-input"
                                style={{ paddingLeft: '1.4rem', fontSize: '0.85rem', fontWeight: 600, padding: '0.35rem 0.5rem 0.35rem 1.4rem' }}
                                value={editAmount}
                                autoFocus
                                onChange={e => setEditAmount(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && saveEdit(acc.id)}
                              />
                            </div>
                            <button onClick={() => saveEdit(acc.id)} style={{
                              background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.3)',
                              borderRadius: '0.5rem', width: 32, height: 32, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Check size={14} color="var(--green)" />
                            </button>
                          </div>
                        ) : (
                          <p style={{ fontWeight: 700, fontSize: '1rem', color: acc.excludeFromTotal ? 'var(--text-secondary)' : 'var(--text-primary)', marginTop: '0.1rem' }}>
                            {formatPHP(acc.balance)}
                          </p>
                        )}
                      </div>
                      {editingId !== acc.id && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                          <button onClick={() => toggleExclude(acc.id, acc.excludeFromTotal)} style={{
                            background: acc.excludeFromTotal ? 'var(--bg-input)' : 'rgba(79,70,229,0.08)', 
                            border: acc.excludeFromTotal ? '1px solid var(--border-color)' : '1px solid rgba(79,70,229,0.2)',
                            borderRadius: '0.5rem', width: 30, height: 30, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }} title={acc.excludeFromTotal ? 'Include in Net Worth' : 'Exclude from Net Worth'}>
                            {acc.excludeFromTotal ? <EyeOff size={12} color="var(--text-secondary)" /> : <Eye size={12} color="var(--accent)" />}
                          </button>
                          <button onClick={() => startEdit(acc)} style={{
                            background: 'var(--accent-glow)', border: '1px solid rgba(79,70,229,0.2)',
                            borderRadius: '0.5rem', width: 30, height: 30, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Pencil size={12} color="var(--accent)" />
                          </button>
                          <button onClick={() => handleDelete(acc.id)} style={{
                            background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '0.5rem', width: 30, height: 30, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Trash2 size={12} color="var(--red)" />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Proportion bar */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{
                        height: 4, borderRadius: 999,
                        background: 'var(--border-color)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          background: acc.color || 'var(--accent)',
                          width: `${proportion}%`,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textAlign: 'right' }}>
                        {proportion.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Add from presets */}
        {!showAddPreset && !showCustomForm && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => setShowAddPreset(true)}
              style={{
                flex: 1, background: 'var(--accent-glow)', border: '1px solid rgba(79,70,229,0.2)',
                borderRadius: '0.75rem', padding: '0.7rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)',
              }}
            >
              <Plus size={16} /> Add Account
            </button>
            <button
              onClick={() => setShowCustomForm(true)}
              style={{
                flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                borderRadius: '0.75rem', padding: '0.7rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)',
              }}
            >
              <Pencil size={14} /> Custom
            </button>
          </div>
        )}

        {/* Preset picker */}
        {showAddPreset && (
          <div className="animate-fade-up" style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            borderRadius: '0.875rem', padding: '1rem', marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Choose an account
              </p>
              <button onClick={() => { setShowAddPreset(false); setSelectedPreset(null); setAddPresetBalance('') }} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)',
                fontFamily: 'inherit',
              }}>Cancel</button>
            </div>

            {availablePresets.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                All presets added! Use "Custom" to add more.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: selectedPreset ? '0.75rem' : 0 }}>
                {availablePresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                      padding: '0.6rem 0.25rem', borderRadius: '0.75rem', cursor: 'pointer',
                      border: selectedPreset?.id === preset.id ? `2px solid ${preset.color}` : '2px solid transparent',
                      background: selectedPreset?.id === preset.id ? `${preset.color}10` : 'var(--bg-card)',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <AccountIcon name={preset.id} size={34} presetData={preset} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedPreset && (
              <div className="animate-fade-up">
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Balance for {selectedPreset.name}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{
                      position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem',
                    }}>₱</span>
                    <input
                      type="text" inputMode="decimal" placeholder="0.00"
                      className="app-input"
                      style={{ paddingLeft: '1.75rem', fontWeight: 700 }}
                      value={addPresetBalance}
                      autoFocus
                      onChange={e => setAddPresetBalance(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddPresetAccount()}
                    />
                  </div>
                  <button onClick={handleAddPresetAccount} className="btn-primary" style={{ width: 'auto', padding: '0.7rem 1.25rem' }}>
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom account form */}
        {showCustomForm && (
          <div className="animate-fade-up" style={{
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            borderRadius: '0.875rem', padding: '1rem', marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Add custom account
              </p>
              <button onClick={() => { setShowCustomForm(false); setCustomName(''); setCustomBalance('') }} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)',
                fontFamily: 'inherit',
              }}>Cancel</button>
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <input
                type="text" placeholder="Account name"
                className="app-input"
                style={{ fontSize: '0.875rem' }}
                value={customName}
                maxLength={30}
                onChange={e => setCustomName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem',
                }}>₱</span>
                <input
                  type="text" inputMode="decimal" placeholder="0.00"
                  className="app-input"
                  style={{ paddingLeft: '1.75rem', fontWeight: 700 }}
                  value={customBalance}
                  onChange={e => setCustomBalance(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Color</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {customColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setCustomColor(c)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c,
                      border: customColor === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>

            <button onClick={handleAddCustom} className="btn-primary">
              Add Account
            </button>
          </div>
        )}

        {/* Close button */}
        <button className="btn-ghost" onClick={onClose} style={{ marginTop: '0.25rem' }}>
          Done
        </button>
      </div>
    </div>
  )
}

export { AccountIcon }
