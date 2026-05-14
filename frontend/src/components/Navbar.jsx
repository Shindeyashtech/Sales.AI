import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function Navbar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const user       = useAuthStore(state => state.user)
  const logout     = useAuthStore(state => state.logout)

  const isActive = (path) => location.pathname === path

  function handleLogout() {
    logout()
    navigate('/')
  }

  const navBtnStyle = (path) => ({
    backgroundColor: isActive(path)
      ? 'rgba(124,58,237,0.12)' : 'transparent',
    color: isActive(path) ? '#7c3aed' : '#64748b',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive(path) ? '600' : '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  })

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(124,58,237,0.1)'
    }}>

      {/* Logo */}
      <div
        onClick={() => {
          if (user?.role === 'superadmin') navigate('/superadmin')
          else if (user?.role === 'admin') navigate('/dashboard')
          else if (user?.role === 'employee') navigate('/upload')
          else navigate('/')
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          📈
        </div>
        <span style={{
          fontWeight: '800',
          fontSize: '20px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Sales.AI
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>

        {/* Employee links */}
        {user?.role === 'employee' && (
          <>
            <button
              onClick={() => navigate('/upload')}
              style={navBtnStyle('/upload')}
            >
              📤 Upload
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={navBtnStyle('/dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate('/coaching')}
              style={navBtnStyle('/coaching')}
            >
              🎯 Coaching
            </button>
          </>
        )}

        {/* Admin links */}
        {user?.role === 'admin' && (
          <>
            <button
              onClick={() => navigate('/dashboard')}
              style={navBtnStyle('/dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate('/team')}
              style={navBtnStyle('/team')}
            >
              👥 Team
            </button>
          </>
        )}

        {/* Super Admin links */}
        {user?.role === 'superadmin' && (
          <button
            onClick={() => navigate('/superadmin')}
            style={{
              ...navBtnStyle('/superadmin'),
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: 'white',
              fontWeight: '600'
            }}
          >
            ⚡ Admin Panel
          </button>
        )}

      </div>

      {/* User Info */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: 'white',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            fontWeight: '700'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a2e'
            }}>
              {user.name}
            </p>
            <p style={{
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'capitalize'
            }}>
              {user.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              padding: '7px 14px',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              marginLeft: '4px'
            }}
          >
            Logout
          </button>
        </div>
      )}

    </nav>
  )
}

export default Navbar