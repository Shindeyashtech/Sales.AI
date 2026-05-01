// Navbar.jsx
// Shows on every page
// Lets user navigate between pages

import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

  function Navbar() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const isActive    = (path) => location.pathname === path
  const user        = useAuthStore(state => state.user)
  const logout      = useAuthStore(state => state.logout)

  function handleLogout() {
    logout()
    navigate('/login')
  }
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
        // onClick={() => navigate('/')}
        onClick={() => 
    user?.role === 'superadmin' 
      ? navigate('/superadmin') 
      : navigate('/')
  }
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
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

  {/* Show these ONLY for normal users */}
{user?.role !== 'superadmin' && (
  <>
    {/* Upload - Employee only */}
    {user?.role === 'employee' && (
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: isActive('/') 
            ? '#4361ee' : 'transparent',
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
    )}

    {/* Dashboard - Everyone except superadmin */}
    <button
      onClick={() => navigate('/dashboard')}
      style={{
        backgroundColor: isActive('/dashboard')
          ? '#4361ee' : 'transparent',
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

    {/* Coaching - Employee only */}
    {user?.role === 'employee' && (
      <button
        onClick={() => navigate('/coaching')}
        style={{
          backgroundColor: isActive('/coaching')
            ? '#4361ee' : 'transparent',
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
    )}

    {/* Team - Admin only */}
    {user?.role === 'admin' && (
      <button
        onClick={() => navigate('/team')}
        style={{
          backgroundColor: isActive('/team')
            ? '#4361ee' : 'transparent',
          color: isActive('/team') ? 'white' : '#666',
          padding: '8px 18px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        👥 Team
      </button>
    )}
  </>
)}

  {/* Show this ONLY for super admin */}
  {user?.role === 'superadmin' && (
    <button
      onClick={() => navigate('/superadmin')}
      style={{
        backgroundColor: '#7209b7',
        color: 'white',
        padding: '8px 18px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      ⚡ Admin Dashboard
    </button>
  )}

  {/* User info and logout - show for everyone */}
  {user && (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: '8px',
      paddingLeft: '12px',
      borderLeft: '1px solid #e2e8f0'
    }}>
      <div style={{
        backgroundColor: user.role === 'superadmin' ? '#7209b7' : '#4361ee',
        color: 'white',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#1a1a2e'
        }}>
          {user.name}
        </p>
        <p style={{
          fontSize: '11px',
          color: '#666',
          textTransform: 'capitalize'
        }}>
          {user.role}
        </p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#fff0f0',
          color: '#dc2626',
          padding: '6px 12px',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '12px',
          marginLeft: '4px'
        }}
      >
        Logout
      </button>
    </div>
  )}

</div>
    </nav>
  )
}

export default Navbar