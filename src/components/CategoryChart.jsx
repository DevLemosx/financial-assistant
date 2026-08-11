import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CategoryChart({ transactions, categoriesById }) {
  const data = useMemo(() => {
    const byCategory = {}
    transactions
      .filter((t) => t.tipo === 'saida')
      .forEach((t) => {
        const cat = t.category_id ? categoriesById[t.category_id] : null
        const nome = cat ? cat.nome : 'Sem categoria'
        const cor = cat ? cat.cor : '#6B7280'
        if (!byCategory[nome]) byCategory[nome] = { name: nome, valor: 0, cor }
        byCategory[nome].valor += Number(t.valor)
      })
    return Object.values(byCategory).sort((a, b) => b.valor - a.valor)
  }, [transactions, categoriesById])

  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-4">
        Gastos por categoria
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-ink-soft py-6 text-center">
          Nenhum gasto no período selecionado.
        </p>
      ) : (
        <div style={{ width: '100%', height: Math.max(140, data.length * 42) }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 12, fill: '#4B554D' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatBRL(value)}
                cursor={{ fill: '#F6F7F3' }}
                contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: '#DCDFD6' }}
              />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={18}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
