import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuthStore from './store/authStore'
import Navbar         from './components/Navbar'
import LandingPage    from './pages/LandingPage'
import UploadPage     from './pages/UploadPage'
import AnalysisPage   from './pages/AnalysisPage'
import DashboardPage  from './pages/DashboardPage'
import CoachingPage   from './pages/CoachingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import SuperAdminPage from './pages/SuperAdminPage'
import TeamPage       from './pages/TeamPage'
import Chatbot        from './components/chatbox'
import './App.css'

function ProtectedRoute({ children, allowedRoles }) {
  const user       = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const isLoading  = useAuthStore(state => state.isLoading)

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8f7ff, #fdf4ff)'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#7c3aed', marginTop: '16px', fontWeight: '500' }}>
          Loading...
        </p>
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'superadmin') return <Navigate to="/superadmin" />
    if (user?.role === 'admin')      return <Navigate to="/dashboard" />
    return <Navigate to="/upload" />
  }

  return children
}

function App() {
  const loadFromStorage = useAuthStore(state => state.loadFromStorage)
  const user       = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/"    element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/organization" element={<RegisterPage />} />
        <Route path="/register/employee"     element={<RegisterPage />} />

        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Navbar /><SuperAdminPage />
          </ProtectedRoute>
        } />

        <Route path="/team" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Navbar /><TeamPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Navbar /><DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/analysis" element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Navbar /><AnalysisPage />
          </ProtectedRoute>
        } />

        <Route path="/upload" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Navbar /><UploadPage />
          </ProtectedRoute>
        } />

        <Route path="/coaching" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Navbar /><CoachingPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={
          isLoggedIn ? (
            user?.role === 'superadmin' ? <Navigate to="/superadmin" /> :
            user?.role === 'admin'      ? <Navigate to="/dashboard"  /> :
                                          <Navigate to="/upload"     />
          ) : <Navigate to="/" />
        } />
      </Routes>

      {/* Floating Chatbot Button - shows on all pages */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999
      }}>
        {showChatbot && (
          <Chatbot onClose={() => setShowChatbot(false)} />
        )}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            fontSize: '26px',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showChatbot ? '✕' : '🤖'}
        </button>
      </div>

    </BrowserRouter>
  )
}

export default App