// DashboardPage.jsx
// Shows all past calls and statistics

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCalls, deleteCall } from '../utils/storage'

function DashboardPage() {

  const navigate = useNavigate()

  // Memory box for all calls
  const [calls, setCalls] = useState([])

  // Load calls when page opens
  useEffect(() => {
    const savedCalls = getCalls()
    setCalls(savedCalls)
  }, [])

  // Delete a call
  function handleDelete(id) {
    if (window.confirm('Delete this call?')) {
      deleteCall(id)
      setCalls(getCalls())
    }
  }

  // Calculate statistics
  const totalCalls = calls.length
  const languages = [...new Set(calls.map(c => c.language))]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>

      {/* Max width container */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>
            📊 Dashboard
          </h1>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#4361ee',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + New Upload
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '30px'
        }}>

          {/* Total Calls */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>TOTAL CALLS</p>
            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#4361ee'
            }}>
              {totalCalls}
            </p>
          </div>

          {/* Languages */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>LANGUAGES</p>
            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#7209b7'
            }}>
              {languages.length}
            </p>
          </div>

          {/* Latest Call */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>LATEST CALL</p>
            <p style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#059669',
              marginTop: '8px'
            }}>
              {calls.length > 0 ? calls[0].date : 'No calls yet'}
            </p>
          </div>

        </div>

        {/* Calls List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>

          <h2 style={{ color: '#1a1a2e', marginBottom: '20px' }}>
            📋 Recent Calls
          </h2>

          {/* If no calls yet */}
          {calls.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999'
            }}>
              <p style={{ fontSize: '48px' }}>📭</p>
              <p style={{ marginTop: '10px' }}>No calls analyzed yet!</p>
              <button
                onClick={() => navigate('/')}
                style={{
                  marginTop: '16px',
                  backgroundColor: '#4361ee',
                  color: 'white',
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Upload First Call
              </button>
            </div>
          )}

          {/* Calls List */}
          {calls.map((call) => (
            <div
              key={call.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >

              {/* Left Side - Call Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>🎙️</span>
                <div>
                  <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
                    {call.filename}
                  </p>
                  <p style={{ color: '#666', fontSize: '13px' }}>
                    {call.date} at {call.time} • {call.size_mb} MB • {call.language}
                  </p>
                </div>
              </div>

              {/* Right Side - Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate('/analysis', {
                    state: { result: call }
                  })}
                  style={{
                    backgroundColor: '#4361ee',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  View Analysis
                </button>
                <button
                  onClick={() => handleDelete(call.id)}
                  style={{
                    backgroundColor: '#fff0f0',
                    color: '#dc2626',
                    padding: '8px 16px',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default DashboardPage