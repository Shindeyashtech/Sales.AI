// LoginPage.jsx
// Login form for all users

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function LoginPage() {

  const navigate    = useNavigate()
  const login       = useAuthStore(state => state.login)

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  async function handleLogin() {

    // Validate inputs
    if (!email || !password) {
      setError('Please fill all fields!')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Send login request to backend
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Login failed!')
        return
      }

      // Save login data globally
      login({
        name:     data.user_name,
        role:     data.user_role,
        org_id:   data.org_id,
        org_name: data.org_name,
        email:    email
      }, data.access_token)

      // Go to dashboard
    //   navigate('/dashboard')
      // Redirect based on role
if (data.user_role === 'superadmin') {
  navigate('/superadmin')
} else if (data.user_role === 'admin') {
  navigate('/dashboard')
} else {
  navigate('/')
}
    } catch (err) {
      setError('Cannot connect to server!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '40px' }}>📈</span>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #4361ee, #7209b7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '8px'
          }}>
            Sales.AI
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
            Sign in to your account
          </p>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#334155',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              color: '#1a1a2e'
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#334155',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              color: '#1a1a2e'
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '12px',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#94a3b8' : '#4361ee',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Signing in...' : '🚀 Sign In'}
        </button>

        {/* Register Links */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '24px'
        }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            New organization?{' '}
            <span
              onClick={() => navigate('/register/organization')}
              style={{
                color: '#4361ee',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Register here
            </span>
          </p>
          <p style={{
            color: '#666',
            fontSize: '14px',
            marginTop: '8px'
          }}>
            Have an org code?{' '}
            <span
              onClick={() => navigate('/register/employee')}
              style={{
                color: '#7209b7',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Join organization
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage