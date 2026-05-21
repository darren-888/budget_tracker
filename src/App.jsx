import React from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'

const SETTINGS_KEY = 'budgettracker_settings'
const TRANSACTIONS_KEY = 'budgettracker_transactions'

export default function App() {
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, null)
  const [transactions, setTransactions] = useLocalStorage(TRANSACTIONS_KEY, [])

  const handleOnboardingComplete = (newSettings) => {
    setSettings(newSettings)
  }

  const handleUpdateSettings = (updatedSettings) => {
    setSettings(updatedSettings)
  }

  const handleAddTransaction = (tx) => {
    setTransactions(prev => [...prev, tx])
  }

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  const handleReset = () => {
    setSettings(null)
    setTransactions([])
    // Clear localStorage explicitly
    localStorage.removeItem(SETTINGS_KEY)
    localStorage.removeItem(TRANSACTIONS_KEY)
  }

  if (!settings) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <Dashboard
      settings={settings}
      transactions={transactions}
      onUpdateSettings={handleUpdateSettings}
      onAddTransaction={handleAddTransaction}
      onDeleteTransaction={handleDeleteTransaction}
      onReset={handleReset}
    />
  )
}
