// App.jsx
// Main app with Navbar on every page

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UploadPage from './pages/UploadPage'
import AnalysisPage from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>

      {/* Navbar shows on every page */}
      <Navbar />

      {/* Pages change based on URL */}
      <Routes>
        <Route path="/"          element={<UploadPage />} />
        <Route path="/analysis"  element={<AnalysisPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App