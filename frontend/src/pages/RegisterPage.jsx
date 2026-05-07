// RegisterPage.jsx
// Two types of registration:
// 1. New Organization (Admin)
// 2. Join Organization (Employee)

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()

  // Check URL to know which type
  const isOrg = window.location.pathname
    .includes('organization')
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [orgName,   setOrgName]   = useState('')
  const [orgCode,   setOrgCode]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [success,   setSuccess]   = useState(null)

  async function handleRegister() {

    // Validate
    if (!name || !email || !password) {
      setError('Please fill all fields!')
      return
    }

    if (isOrg && !orgName) {
      setError('Please enter organization name!')
      return
    }

    if (!isOrg && !orgCode) {
      setError('Please enter organization code!')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Choose endpoint based on type
      const endpoint = isOrg
        ? 'http://import.meta.env.VITE_API_URL/api/v1/auth/register/organization'
        : 'http://import.meta.env.VITE_API_URL/api/v1/auth/register/employee'

      // Build request body
      const body = isOrg
        ? { org_name: orgName, name, email, password }
        : { org_code: orgCode.toUpperCase(), name, email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Registration failed!')
        return
      }

      // Show success message
      setSuccess(data)

    } catch (err) {
      setError('Cannot connect to server!')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '60px' }}>🎉</span>
          <h2 style={{ color: '#1a1a2e', marginTop: '16px' }}>
            Account Created!
          </h2>

          {/* Show org code for admin */}
          {isOrg && success.org_code && (
            <div style={{
              backgroundColor: '#f8faff',
              border: '2px solid #4361ee',
              borderRadius: '12px',
              padding: '20px',
              margin: '20px 0'
            }}>
              <p style={{ color: '#666', fontSize: '13px' }}>
                YOUR ORGANIZATION CODE
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#4361ee',
                letterSpacing: '4px',
                marginTop: '8px'
              }}>
                {success.org_code}
              </p>
              <p style={{
                color: '#666',
                fontSize: '12px',
                marginTop: '8px'
              }}>
                Share this code with your team members
                so they can join your organization!
              </p>
            </div>
          )}

          <p style={{ color: '#666', fontSize: '14px' }}>
            {success.message}
          </p>

          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '14px',
              backgroundColor: '#4361ee',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Login →
          </button>
        </div>
      </div>
    )
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
            {isOrg
              ? '🏢 Register your organization'
              : '👤 Join your organization'}
          </p>
        </div>

        {/* Org Name (for admin only) */}
        {isOrg && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              🏢 Organization Name
            </label>
            <input
              type="text"
              placeholder="Your company name..."
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
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
        )}

        {/* Org Code (for employee only) */}
        {!isOrg && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              🔑 Organization Code
            </label>
            <input
              type="text"
              placeholder="Enter org code (e.g. SALES123)..."
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#1a1a2e',
                textTransform: 'uppercase'
              }}
            />
          </div>
        )}

        {/* Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#334155',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            👤 Your Name
          </label>
          <input
            type="text"
            placeholder="Your full name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
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

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            color: '#334155',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            📧 Email Address
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

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#334155',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            🔐 Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Error */}
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

        {/* Register Button */}
        <button
          onClick={handleRegister}
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
          {loading ? '⏳ Creating...' : '✅ Create Account'}
        </button>

        {/* Back to login */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          Already have account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#4361ee',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage