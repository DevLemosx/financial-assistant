const OPTIONS = [
  { value: 'dia', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
  { value: 'tudo', label: 'Tudo' },
]

export default function PeriodFilter({ value, onChange }) {
  return (
    <div className="inline-flex bg-white border border-line rounded-lg p-1 gap-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === opt.value ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
