// App.jsx
// This file controls all our pages
// Think of it like a traffic controller

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import AnalysisPage from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'
import './App.css'

function App() {
  return (
    // BrowserRouter enables navigation in our app
    <BrowserRouter>
      <Routes>
        {/* Each Route is like a door to a page */}
        <Route path="/"          element={<UploadPage />} />
        <Route path="/analysis"  element={<AnalysisPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App