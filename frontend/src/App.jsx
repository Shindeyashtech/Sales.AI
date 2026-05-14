import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import Navbar        from './components/Navbar'
import LandingPage   from './pages/LandingPage'
import UploadPage    from './pages/UploadPage'
import AnalysisPage  from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import CoachingPage  from './pages/CoachingPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import SuperAdminPage from './pages/SuperAdminPage'
import TeamPage      from './pages/TeamPage'
import './App.css'

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const user      = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const isLoading  = useAuthStore(state => state.isLoading)

  // Wait for auth to load from localStorage!
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#f0f2f5'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#666', marginTop: '16px' }}>
          Loading...
        </p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'superadmin') return <Navigate to="/superadmin" />
    if (user?.role === 'admin')      return <Navigate to="/dashboard" />
    return <Navigate to="/upload" />
  }

  return children
}

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to correct home based on role
    if (user?.role === 'superadmin') return <Navigate to="/superadmin" />
    if (user?.role === 'admin') return <Navigate to="/dashboard" />
    return <Navigate to="/upload" />
  }

  return children


function App() {
  const loadFromStorage = useAuthStore(state => state.loadFromStorage)
  const user = useAuthStore(state => state.user)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes - no navbar */}
        <Route path="/"
          element={<LandingPage />}
        />
        <Route path="/login"
          element={<LoginPage />}
        />
        <Route path="/register/organization"
          element={<RegisterPage />}
        />
        <Route path="/register/employee"
          element={<RegisterPage />}
        />

        {/* Super Admin routes */}
        <Route path="/superadmin" element=
        {
          <ProtectedRoute allowedRoles={['superadmin']}>
            <Navbar />
            <SuperAdminPage />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/team" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Navbar />
            <TeamPage />
          </ProtectedRoute>
        } />

        {/* Shared routes - admin and employee */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Navbar />
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/analysis" element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Navbar />
            <AnalysisPage />
          </ProtectedRoute>
        } />

        {/* Employee only routes */}
        <Route path="/upload" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Navbar />
            <UploadPage />
          </ProtectedRoute>
        } />

        <Route path="/coaching" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Navbar />
            <CoachingPage />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect based on role */}
        <Route path="*" element={
          isLoggedIn ? (
            user?.role === 'superadmin' ? <Navigate to="/superadmin" /> :
            user?.role === 'admin'      ? <Navigate to="/dashboard" />  :
                                          <Navigate to="/upload" />
          ) : (
            <Navigate to="/" />
          )
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App