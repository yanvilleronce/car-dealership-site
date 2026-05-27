import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import { track } from './utils/track'
import Footer from './components/layout/Footer'
import { MobileCTA } from './components/ui/MobileCTA'
import Home from './pages/Home'
import VehicleDetail from './pages/VehicleDetail'
import InventoryPage from './pages/InventoryPage'
import MentionsLegales from './pages/MentionsLegales'
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite'
import { checkAuth, login as authLogin, logout as authLogout } from './inventory/auth'

const AdminPanel = lazy(() => import('./components/admin/AdminPanel'))
const LoginPage = lazy(() => import('./components/admin/LoginPage'))

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
      <MobileCTA />
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => checkAuth())
  const location = useLocation()

  useEffect(() => {
    track('page_view', { pathname: location.pathname })
  }, [location.pathname])

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
      <Route path="/admin" element={<Suspense fallback={null}><AdminRoute authed={authed} onLogin={handleLogin} onLogout={handleLogout} /></Suspense>} />
      <Route path="/admin/*" element={<Suspense fallback={null}><AdminRoute authed={authed} onLogin={handleLogin} onLogout={handleLogout} /></Suspense>} />

      {/* Public site */}
      <Route path="/*" element={
        <PublicLayout>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/inventaire"          element={<InventoryPage type="all" />} />
            <Route path="/vehicules/neufs"     element={<InventoryPage type="new" />} />
            <Route path="/vehicules/occasion"  element={<InventoryPage type="used" />} />
            <Route path="/vehicule/:id"        element={<VehicleDetail />} />
            <Route path="/mentions-legales"    element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="*"                    element={<InventoryPage type="all" />} />
          </Routes>
        </PublicLayout>
      } />
    </Routes>
  )
}
