import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { WhatsAppButton } from './components/ui/MobileCTA'
import { MobileCTA } from './components/ui/MobileCTA'
import Home from './pages/Home'
import AdminPanel from './components/admin/AdminPanel'
import LoginPage from './components/admin/LoginPage'
import { checkAuth, login as authLogin, logout as authLogout } from './inventory/auth'

// Placeholder pages — will be built as separate pages in future iterations
function ComingSoon({ title }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gold font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4">Bientôt disponible</p>
        <h1 className="font-serif text-display-md text-white mb-4">{title}</h1>
        <p className="text-text-muted font-sans text-sm">Cette page est en cours de développement.</p>
      </div>
    </main>
  )
}

// Admin route wrapper — strips Navbar/Footer/CTAs for a clean workspace
function AdminRoute({ authed, onLogin, onLogout }) {
  if (!authed) return <LoginPage onLogin={onLogin} />
  return <AdminPanel onLogout={onLogout} />
}

// Public layout wrapper
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <MobileCTA />
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => checkAuth())

  const handleLogin = useCallback((email, password) => {
    const ok = authLogin(email, password)
    if (ok) setAuthed(true)
    return ok
  }, [])

  const handleLogout = useCallback(() => {
    authLogout()
    setAuthed(false)
  }, [])

  return (
    <Routes>
      {/* Admin — no nav/footer/CTAs */}
      <Route path="/admin" element={<AdminRoute authed={authed} onLogin={handleLogin} onLogout={handleLogout} />} />
      <Route path="/admin/*" element={<AdminRoute authed={authed} onLogin={handleLogin} onLogout={handleLogout} />} />

      {/* Public site */}
      <Route path="/*" element={
        <PublicLayout>
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/neufs"   element={<ComingSoon title="Véhicules Neufs" />} />
            <Route path="/occasion" element={<ComingSoon title="Véhicules d'Occasion" />} />
            <Route path="*"        element={<ComingSoon title="Page introuvable" />} />
          </Routes>
        </PublicLayout>
      } />
    </Routes>
  )
}
