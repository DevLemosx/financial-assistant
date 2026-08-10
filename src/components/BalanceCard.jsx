function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function BalanceCard({ saldo, totalEntradas, totalSaidas }) {
  return (
    <div className="bg-pine text-white rounded-lg p-6">
      <p className="font-mono text-xs tracking-widest uppercase text-white/70 mb-1">
        Saldo atual
      </p>
      <p className="font-ledger text-4xl font-semibold mb-6">{formatBRL(saldo)}</p>

      <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
        <div>
          <p className="text-xs text-white/70 mb-1">Entradas</p>
          <p className="font-ledger text-lg text-gold">{formatBRL(totalEntradas)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70 mb-1">Saídas</p>
          <p className="font-ledger text-lg text-rust/90">{formatBRL(totalSaidas)}</p>
        </div>
      </div>
    </div>
  )
}
