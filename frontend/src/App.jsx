// App.jsx - This is the main file of our app
// Think of it like the "home base" that controls all pages

import { useState } from 'react'
import './App.css'
import UploadPage from './pages/UploadPage'

function App() {
  return (
    <div>
      <UploadPage />
    </div>
  )
}

export default App