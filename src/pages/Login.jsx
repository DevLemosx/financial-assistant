import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { error } =
      mode === 'login' ? await signIn(email, password) : await signUp(email, password)

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup') {
      setInfo('Conta criada. Verifique seu e-mail se a confirmação estiver ativada, ou faça login.')
      setMode('login')
      return
    }

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-widest text-ink-soft uppercase mb-1">
            Assistente Financeiro
          </p>
          <h1 className="text-2xl font-semibold text-ink">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-line rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}
          {info && <p className="text-sm text-pine">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-pine hover:bg-pine-dark transition-colors text-white text-sm font-medium py-2.5 rounded-md disabled:opacity-60"
          >
            {submitting ? 'Enviando…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login')
            setError('')
            setInfo('')
          }}
          className="w-full text-center text-sm text-ink-soft mt-4 hover:text-ink"
        >
          {mode === 'login' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  )
}
