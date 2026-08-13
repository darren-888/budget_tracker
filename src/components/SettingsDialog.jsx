import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Settings } from 'lucide-react'
import { DEFAULT_CATEGORIES } from '../utils/categories'

// ─── Field extracted OUTSIDE to prevent unmount/remount on every keystroke ───
function SettingsField({ label, fieldKey, form, errors, setForm, setErrors }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <label style={{
        display: 'block', fontSize: '0.78rem', fontWeight: 600,
        color: 'var(--text-secondary)', marginBottom: '0.35rem',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem',
        }}>₱</span>
        <input
          type="text"
          inputMode="decimal"
          className="app-input"
          style={{ paddingLeft: '2rem' }}
          value={form[fieldKey]}
          onChange={e => {
            const val = e.target.value
            setForm(f => ({ ...f, [fieldKey]: val }))
            setErrors(er => ({ ...er, [fieldKey]: null }))
          }}
        />
      </div>
      {errors[fieldKey] && (
        <p style={{ fontSize: '0.7rem', color: 'var(--red)', marginTop: '0.25rem' }}>
          ⚠ {errors[fieldKey]}
        </p>
      )}
    </div>
  )
}

export default function SettingsDialog({ isOpen, onClose, settings, onSave, onReset }) {
  const [form, setForm] = useState({
    startingBalance: settings.startingBalance,
    weeklyAllowance: settings.weeklyAllowance,
    weeklySpendLimit: settings.weeklySpendLimit,
    customCategories: [...(settings.customCategories || [])],
  })
  const [newCategory, setNewCategory] = useState('')
  const [errors, setErrors] = useState({})
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Sync form values when settings change externally
  useEffect(() => {
    setForm({
      startingBalance: settings.startingBalance,
      weeklyAllowance: settings.weeklyAllowance,
      weeklySpendLimit: settings.weeklySpendLimit,
      customCategories: [...(settings.customCategories || [])],
    })
    setErrors({})
    setShowResetConfirm(false)
  }, [isOpen]) // reset form state whenever dialog opens/closes

  if (!isOpen) return null

  const validate = () => {
    const errs = {}
    if (form.startingBalance === '' || isNaN(Number(form.startingBalance)))
      errs.startingBalance = 'Enter a valid number'
    if (!form.weeklyAllowance || isNaN(Number(form.weeklyAllowance)) || Number(form.weeklyAllowance) <= 0)
      errs.weeklyAllowance = 'Enter a valid amount'
    if (!form.weeklySpendLimit || isNaN(Number(form.weeklySpendLimit)) || Number(form.weeklySpendLimit) <= 0)
      errs.weeklySpendLimit = 'Enter a valid amount'
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      ...settings,
      startingBalance: Number(form.startingBalance),
      weeklyAllowance: Number(form.weeklyAllowance),
      weeklySpendLimit: Number(form.weeklySpendLimit),
      customCategories: form.customCategories,
    })
    onClose()
  }

  const addCategory = () => {
    const trimmed = newCategory.trim()
    if (!trimmed) return
    const allCats = [...DEFAULT_CATEGORIES, ...form.customCategories]
    if (allCats.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) return
    setForm(f => ({ ...f, customCategories: [...f.customCategories, trimmed] }))
    setNewCategory('')
  }

  const removeCustomCategory = (cat) => {
    setForm(f => ({ ...f, customCategories: f.customCategories.filter(c => c !== cat) }))
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '0.625rem',
              background: 'var(--accent-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Settings size={17} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h2>
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

        {/* Budget fields */}
        <div style={{
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem',
        }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
            marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Budget Settings
          </p>
          <SettingsField label="Starting Savings Balance" fieldKey="startingBalance" form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
          <SettingsField label="Weekly Allowance" fieldKey="weeklyAllowance" form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
          <SettingsField label="Weekly Spend Limit" fieldKey="weeklySpendLimit" form={form} errors={errors} setForm={setForm} setErrors={setErrors} />
        </div>

        {/* Categories */}
        <div style={{
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem',
        }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
            marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Categories
          </p>

          {/* Default categories (read-only) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {DEFAULT_CATEGORIES.map(cat => (
              <span key={cat} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem',
                color: 'var(--text-secondary)', fontWeight: 500,
              }}>
                {cat}
              </span>
            ))}
          </div>

          {/* Custom categories */}
          {form.customCategories.map(cat => (
            <div key={cat} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--accent-glow)', border: '1px solid rgba(79,70,229,0.15)',
              borderRadius: '0.625rem', padding: '8px 12px', marginBottom: '0.4rem',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>✦ {cat}</span>
              <button
                onClick={() => removeCustomCategory(cat)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
              >
                <Trash2 size={13} color="var(--red)" />
              </button>
            </div>
          ))}

          {/* Add custom category */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text" placeholder="New category name…"
              className="app-input"
              style={{ flex: 1, fontSize: '0.8rem' }}
              value={newCategory}
              maxLength={20}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            />
            <button
              type="button" onClick={addCategory}
              style={{
                background: 'var(--accent-glow)', border: '1px solid rgba(79,70,229,0.2)',
                borderRadius: '0.75rem', width: 42, flexShrink: 0, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Plus size={17} color="var(--accent)" />
            </button>
          </div>
        </div>

        {/* Save / Reset */}
        <button className="btn-primary" onClick={handleSave} style={{ marginBottom: '0.6rem' }}>
          Save Changes
        </button>

        {!showResetConfirm ? (
          <button className="btn-ghost" onClick={() => setShowResetConfirm(true)} style={{ fontSize: '0.8rem' }}>
            🗑 Reset All Data
          </button>
        ) : (
          <div style={{
            background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '0.875rem', padding: '0.875rem', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--red)', marginBottom: '0.75rem', fontWeight: 600 }}>
              ⚠ This will delete ALL data. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => { onReset(); onClose() }}
                style={{
                  flex: 1, background: 'var(--red)', color: '#fff', border: 'none',
                  borderRadius: '0.75rem', padding: '0.6rem', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.8rem', fontFamily: 'inherit',
                }}
              >
                Yes, Reset
              </button>
              <button className="btn-ghost" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
