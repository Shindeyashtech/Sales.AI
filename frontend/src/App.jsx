import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'

import Navbar        from './components/Navbar'
import UploadPage    from './pages/UploadPage'
import AnalysisPage  from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import CoachingPage  from './pages/CoachingPage'
import SuperAdminPage from './pages/SuperAdminPage'
import TeamPage from './pages/TeamPage'
import LoginPage     from './pages/LoginPage'
import LandingPage   from './pages/LandingPage'
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

        {/* Protected routes with Navbar */}
       <Route path="/upload" element={
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
        <Route path="/superadmin" element={
  <><Navbar /><SuperAdminPage /></>
} />
<Route path="/team" element={
  <><Navbar /><TeamPage /></>
} />

{/* <Route path="/upload" element={
  <><Navbar /><UploadPage /></>
} /> */}


      </Routes>
    </BrowserRouter>
  )
}

export default App