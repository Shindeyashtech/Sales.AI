// Navbar.jsx
// Shows on every page
// Lets user navigate between pages

import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()
  const location = useLocation()

  // Check which page we are on
  // This helps us highlight active page
  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '0 30px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px',
      position: 'sticky',  // stays at top when scrolling
      top: 0,
      zIndex: 100
    }}>

      {/* Left Side - Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
       <span style={{ fontSize: '24px' }}>📈</span>
<span style={{
  fontWeight: '800',
  fontSize: '20px',
  background: 'linear-gradient(90deg, #4361ee, #7209b7)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}>
  Sales.AI
</span>
      </div>

      {/* Right Side - Navigation Links */}
      <div style={{ display: 'flex', gap: '8px' }}>

        {/* Upload Link */}
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: isActive('/') ? '#4361ee' : 'transparent',
            color: isActive('/') ? 'white' : '#666',
            padding: '8px 18px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📤 Upload
        </button>
          {/* Coaching Link */}
<button
  onClick={() => navigate('/coaching')}
  style={{
    backgroundColor: isActive('/coaching') ? '#4361ee' : 'transparent',
    color: isActive('/coaching') ? 'white' : '#666',
    padding: '8px 18px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }}
>
  🎯 Coaching
</button>
        {/* Dashboard Link */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: isActive('/dashboard') ? '#4361ee' : 'transparent',
            color: isActive('/dashboard') ? 'white' : '#666',
            padding: '8px 18px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📊 Dashboard
        </button>

      </div>

    </nav>
  )
}

export default Navbar