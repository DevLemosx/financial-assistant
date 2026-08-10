import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import BalanceCard from '../components/BalanceCard'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import CategoryManager from '../components/CategoryManager'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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

  const { saldo, totalEntradas, totalSaidas } = useMemo(() => {
    const totalEntradas = transactions
      .filter((t) => t.tipo === 'entrada')
      .reduce((sum, t) => sum + Number(t.valor), 0)
    const totalSaidas = transactions
      .filter((t) => t.tipo === 'saida')
      .reduce((sum, t) => sum + Number(t.valor), 0)
    return { saldo: totalEntradas - totalSaidas, totalEntradas, totalSaidas }
  }, [transactions])

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
          <button
            onClick={signOut}
            className="text-sm text-ink-soft hover:text-rust"
          >
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
              <TransactionList
                transactions={transactions}
                categoriesById={categoriesById}
                onChanged={loadData}
              />
            </div>
            <div className="space-y-6">
              <TransactionForm categories={categories} onCreated={loadData} />
              <CategoryManager categories={categories} onChanged={loadData} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
