import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

import Navbar        from './components/Navbar'
import UploadPage    from './pages/UploadPage'
import AnalysisPage  from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import CoachingPage  from './pages/CoachingPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import './App.css'

function App() {

  const loadFromStorage = useAuthStore(
    state => state.loadFromStorage
  )

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login"
          element={<LoginPage />}
        />
        <Route path="/register/organization"
          element={<RegisterPage />}
        />
        <Route path="/register/employee"
          element={<RegisterPage />}
        />

        {/* Protected routes with Navbar */}
        <Route path="/" element={
          <><Navbar /><UploadPage /></>
        } />
        <Route path="/analysis" element={
          <><Navbar /><AnalysisPage /></>
        } />
        <Route path="/dashboard" element={
          <><Navbar /><DashboardPage /></>
        } />
        <Route path="/coaching" element={
          <><Navbar /><CoachingPage /></>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App