import { supabase } from '../lib/supabaseClient'

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(dateStr) {
  const [ano, mes, dia] = dateStr.split('-')
  return `${dia}/${mes}`
}

export default function TransactionList({ transactions, categoriesById, onChanged }) {
  async function handleDelete(id) {
    await supabase.from('transactions').delete().eq('id', id)
    onChanged()
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-line rounded-lg p-8 text-center">
        <p className="text-sm text-ink-soft">Nenhuma transação ainda. Registre a primeira ao lado.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-4">
        Histórico
      </p>
      <ul>
        {transactions.map((t, i) => {
          const categoria = t.category_id ? categoriesById[t.category_id] : null
          return (
            <li key={t.id}>
              <div className="flex items-center justify-between py-3 group">
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">
                    {t.descricao || categoria?.nome || (t.tipo === 'entrada' ? 'Entrada' : 'Saída')}
                  </p>
                  <p className="font-mono text-xs text-ink-soft mt-0.5">
                    {formatData(t.data)}{categoria ? ` · ${categoria.nome}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`font-ledger text-sm font-medium ${
                      t.tipo === 'entrada' ? 'text-pine' : 'text-rust'
                    }`}
                  >
                    {t.tipo === 'entrada' ? '+' : '−'} {formatBRL(t.valor)}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-soft hover:text-rust text-xs"
                    aria-label="Excluir transação"
                  >
                    excluir
                  </button>
                </div>
              </div>
              {i < transactions.length - 1 && <div className="receipt-divider" />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
