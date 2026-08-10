import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function TransactionForm({ categories, onCreated }) {
  const { user } = useAuth()
  const [tipo, setTipo] = useState('saida')
  const [valor, setValor] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const categoriasFiltradas = categories.filter((c) => c.tipo === tipo || c.tipo === 'ambos')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const valorNumerico = Number(valor.replace(',', '.'))
    if (!valorNumerico || valorNumerico <= 0) {
      setError('Informe um valor válido.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      tipo,
      valor: valorNumerico,
      category_id: categoryId || null,
      descricao,
      data,
    })
    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    setValor('')
    setDescricao('')
    onCreated()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-line rounded-lg p-5 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTipo('saida')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tipo === 'saida' ? 'bg-rust text-white' : 'bg-paper text-ink-soft border border-line'
          }`}
        >
          Saída
        </button>
        <button
          type="button"
          onClick={() => setTipo('entrada')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            tipo === 'entrada' ? 'bg-pine text-white' : 'bg-paper text-ink-soft border border-line'
          }`}
        >
          Entrada
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1">Valor (R$)</label>
          <input
            type="text"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            className="w-full border border-line rounded-md px-3 py-2 text-sm font-ledger focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-soft mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1">Categoria</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
        >
          <option value="">Sem categoria</option>
          {categoriasFiltradas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink-soft mb-1">Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: almoço, uber, salário…"
          className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
        />
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink hover:bg-black transition-colors text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-60"
      >
        {submitting ? 'Registrando…' : 'Registrar'}
      </button>
    </form>
  )
}
