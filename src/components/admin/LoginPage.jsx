import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email requis'); return }
    if (!password.trim()) { setError('Mot de passe requis'); return }
    setLoading(true); setError('')
    const ok = onLogin(email, password)
    if (!ok) { setError('Identifiants incorrects'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface-1 border border-border rounded-sm p-8">
          <div className="text-center mb-8">
            <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Administration
            </p>
            <h1 className="font-serif text-2xl text-white">AUTOMOBILE RENNAIS</h1>
            <p className="text-text-muted font-sans text-sm mt-2">
              Gestion du stock
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="admin@exemple.com"
                className="input-base"
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-sans font-medium text-text-secondary mb-1.5">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Entrez le mot de passe"
                className="input-base"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-sans flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="btn-primary w-full justify-center py-3 mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion…' : 'Accéder au panneau'}
            </button>
          </form>
        </div>

        <a
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-text-muted hover:text-gold font-sans text-xs transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au site public
        </a>
      </div>
    </div>
  )
}
