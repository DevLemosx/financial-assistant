import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { getPeriodRange, isWithinRange } from '../lib/dateRanges'
import BalanceCard from '../components/BalanceCard'
import MonthSummaryCard from '../components/MonthSummaryCard'
import PeriodFilter from '../components/PeriodFilter'
import CategoryChart from '../components/CategoryChart'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import CategoryManager from '../components/CategoryManager'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('mes')
  const [editingTransaction, setEditingTransaction] = useState(null)

  const loadData = useCallback(async () => {
    const [{ data: tx }, { data: cats }] = await Promise.all([
      supabase.from('transactions').select('*').order('data', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('nome'),
    ])
    setTransactions(tx ?? [])
    setCategories(cats ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  )

  // Saldo total (todas as transações, independente do filtro de período)
  const { saldo, totalEntradas, totalSaidas } = useMemo(() => {
    const totalEntradas = transactions
      .filter((t) => t.tipo === 'entrada')
      .reduce((sum, t) => sum + Number(t.valor), 0)
    const totalSaidas = transactions
      .filter((t) => t.tipo === 'saida')
      .reduce((sum, t) => sum + Number(t.valor), 0)
    return { saldo: totalEntradas - totalSaidas, totalEntradas, totalSaidas }
  }, [transactions])

  // Transações filtradas pelo período selecionado (afeta gráfico e histórico)
  const filteredTransactions = useMemo(() => {
    const range = getPeriodRange(period)
    return transactions.filter((t) => isWithinRange(t.data, range))
  }, [transactions, period])

  function handleEdit(transaction) {
    setEditingTransaction(transaction)
  }

  function handleSaved() {
    setEditingTransaction(null)
    loadData()
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-ink-soft">
              Assistente Financeiro
            </p>
            <p className="text-sm text-ink-soft">{user?.email}</p>
          </div>
          <button onClick={signOut} className="text-sm text-ink-soft hover:text-rust">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <p className="font-mono text-sm text-ink-soft">carregando…</p>
        ) : (
          <div className="grid md:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="space-y-6">
              <BalanceCard saldo={saldo} totalEntradas={totalEntradas} totalSaidas={totalSaidas} />
              <MonthSummaryCard transactions={transactions} />

              <div className="flex items-center justify-between">
                <p className="font-mono text-xs tracking-widest uppercase text-ink-soft">Período</p>
                <PeriodFilter value={period} onChange={setPeriod} />
              </div>

              <CategoryChart transactions={filteredTransactions} categoriesById={categoriesById} />

              <TransactionList
                transactions={filteredTransactions}
                categoriesById={categoriesById}
                onChanged={loadData}
                onEdit={handleEdit}
              />
            </div>
            <div className="space-y-6">
              <TransactionForm
                categories={categories}
                onSaved={handleSaved}
                editing={editingTransaction}
                onCancelEdit={() => setEditingTransaction(null)}
              />
              <CategoryManager categories={categories} onChanged={loadData} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
