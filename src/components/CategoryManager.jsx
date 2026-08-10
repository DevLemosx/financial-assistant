import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const CORES = ['#2F5233', '#A98B32', '#A13F2B', '#4B554D', '#6B7280']

export default function CategoryManager({ categories, onChanged }) {
  const { user } = useAuth()
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('ambos')
  const [cor, setCor] = useState(CORES[0])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!nome.trim()) return

    const { error } = await supabase.from('categories').insert({
      user_id: user.id,
      nome: nome.trim(),
      tipo,
      cor,
    })

    if (error) {
      setError(error.message)
      return
    }

    setNome('')
    onChanged()
  }

  async function handleDelete(id) {
    await supabase.from('categories').delete().eq('id', id)
    onChanged()
  }

  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs tracking-widest uppercase text-ink-soft">Categorias</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-pine hover:text-pine-dark font-medium"
        >
          {open ? 'fechar' : '+ nova'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map((c) => (
          <span
            key={c.id}
            className="group inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-line"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.cor }} />
            {c.nome}
            <button
              onClick={() => handleDelete(c.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-soft hover:text-rust ml-0.5"
              aria-label={`Excluir categoria ${c.nome}`}
            >
              ×
            </button>
          </span>
        ))}
        {categories.length === 0 && (
          <p className="text-xs text-ink-soft">Nenhuma categoria ainda.</p>
        )}
      </div>

      {open && (
        <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-line">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da categoria"
            className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
          />
          <div className="flex gap-2">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="flex-1 border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            >
              <option value="ambos">Entrada e saída</option>
              <option value="entrada">Só entrada</option>
              <option value="saida">Só saída</option>
            </select>
            <div className="flex items-center gap-1.5 px-2 border border-line rounded-md">
              {CORES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  className={`w-5 h-5 rounded-full ${cor === c ? 'ring-2 ring-offset-1 ring-ink' : ''}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Cor ${c}`}
                />
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-rust">{error}</p>}
          <button
            type="submit"
            className="w-full bg-ink hover:bg-black transition-colors text-white text-sm font-medium py-2 rounded-md"
          >
            Adicionar categoria
          </button>
        </form>
      )}
    </div>
  )
}
