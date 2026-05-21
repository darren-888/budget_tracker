import React, { useState } from 'react'
import { Wallet, ChevronRight } from 'lucide-react'
import { DEFAULT_CATEGORIES } from '../utils/categories'

export default function Onboarding({ onComplete }) {
  const [form, setForm] = useState({
    startingBalance: '',
    weeklyAllowance: '',
    weeklySpendLimit: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.startingBalance || isNaN(form.startingBalance) || Number(form.startingBalance) < 0)
      errs.startingBalance = 'Enter a valid amount'
    if (!form.weeklyAllowance || isNaN(form.weeklyAllowance) || Number(form.weeklyAllowance) <= 0)
      errs.weeklyAllowance = 'Enter a valid weekly allowance'
    if (!form.weeklySpendLimit || isNaN(form.weeklySpendLimit) || Number(form.weeklySpendLimit) <= 0)
      errs.weeklySpendLimit = 'Enter a valid spend limit'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onComplete({
      startingBalance: Number(form.startingBalance),
      weeklyAllowance: Number(form.weeklyAllowance),
      weeklySpendLimit: Number(form.weeklySpendLimit),
      customCategories: [],
      setupDate: new Date().toISOString(),
    })
  }

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Logo / Hero */}
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 32px rgba(16,185,129,0.35)',
          }}
        >
          <Wallet size={36} color="#fff" />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Budget Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Private. Personal. Always on your device.
        </p>
      </div>

      {/* Setup Card */}
      <div
        className="glass-card animate-fade-up stagger-1"
        style={{ width: '100%', maxWidth: 420, padding: '1.75rem' }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Let's set up your budget
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
          This info stays on your device only — no accounts, no servers.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FieldGroup
            label="Starting Savings Balance"
            hint="How much do you have saved right now?"
            error={errors.startingBalance}
          >
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem'
              }}>₱</span>
              <input
                type="text" inputMode="decimal" placeholder="19000"
                className="app-input"
                style={{ paddingLeft: '2rem' }}
                value={form.startingBalance}
                onChange={e => handleChange('startingBalance', e.target.value)}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            label="Weekly Allowance"
            hint="How much do you receive each week?"
            error={errors.weeklyAllowance}
          >
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem'
              }}>₱</span>
              <input
                type="text" inputMode="decimal" placeholder="2000"
                className="app-input"
                style={{ paddingLeft: '2rem' }}
                value={form.weeklyAllowance}
                onChange={e => handleChange('weeklyAllowance', e.target.value)}
              />
            </div>
          </FieldGroup>

          <FieldGroup
            label="Weekly Spend Limit"
            hint="Max you want to spend per week"
            error={errors.weeklySpendLimit}
          >
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem'
              }}>₱</span>
              <input
                type="text" inputMode="decimal" placeholder="1000"
                className="app-input"
                style={{ paddingLeft: '2rem' }}
                value={form.weeklySpendLimit}
                onChange={e => handleChange('weeklySpendLimit', e.target.value)}
              />
            </div>
          </FieldGroup>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Get Started <ChevronRight size={18} />
          </button>
        </form>
      </div>

      <p className="animate-fade-up stagger-2" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '1.5rem', textAlign: 'center' }}>
        You can edit these anytime via Settings ⚙️
      </p>
    </div>
  )
}

function FieldGroup({ label, hint, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
        {label}
      </label>
      {hint && (
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{hint}</p>
      )}
      {children}
      {error && (
        <p style={{ fontSize: '0.72rem', color: '#fb7185', marginTop: '0.3rem' }}>⚠ {error}</p>
      )}
    </div>
  )
}
