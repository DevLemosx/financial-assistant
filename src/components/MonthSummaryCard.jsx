import { useMemo } from 'react'
import { getMonthRange, isWithinRange } from '../lib/dateRanges'

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function MonthSummaryCard({ transactions }) {
  const { nomeMes, entradas, saidas, saldoMes } = useMemo(() => {
    const now = new Date()
    const range = getMonthRange(now)
    const doMes = transactions.filter((t) => isWithinRange(t.data, range))
    const entradas = doMes.filter((t) => t.tipo === 'entrada').reduce((s, t) => s + Number(t.valor), 0)
    const saidas = doMes.filter((t) => t.tipo === 'saida').reduce((s, t) => s + Number(t.valor), 0)
    const nomeMes = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return { nomeMes, entradas, saidas, saldoMes: entradas - saidas }
  }, [transactions])

  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-3">
        Resumo de {nomeMes}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-ink-soft mb-1">Entradas</p>
          <p className="font-ledger text-base font-medium text-pine">{formatBRL(entradas)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft mb-1">Saídas</p>
          <p className="font-ledger text-base font-medium text-rust">{formatBRL(saidas)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft mb-1">Saldo do mês</p>
          <p className={`font-ledger text-base font-medium ${saldoMes >= 0 ? 'text-pine' : 'text-rust'}`}>
            {formatBRL(saldoMes)}
          </p>
        </div>
      </div>
    </div>
  )
}
