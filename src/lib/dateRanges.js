export function todayLocalISO(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return { start: todayLocalISO(start), end: todayLocalISO(end) }
}

export function getPeriodRange(period, date = new Date()) {
  if (period === 'dia') {
    const iso = todayLocalISO(date)
    return { start: iso, end: iso }
  }

  if (period === 'semana') {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay()) // domingo
    const end = new Date(start)
    end.setDate(start.getDate() + 6) // sábado
    return { start: todayLocalISO(start), end: todayLocalISO(end) }
  }

  if (period === 'mes') {
    return getMonthRange(date)
  }

  return null // 'tudo'
}

export function isWithinRange(dateStr, range) {
  if (!range) return true
  return dateStr >= range.start && dateStr <= range.end
}
