// TeamPage.jsx
// Org Admin sees all team members
// and their call statistics

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function TeamPage() {

  const navigate = useNavigate()
  const token    = useAuthStore(state => state.token)
  const user     = useAuthStore(state => state.user)

  const [team,    setTeam]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only admin can see this page
    if (user?.role !== 'admin') {
      navigate('/')
      return
    }
    fetchTeam()
  }, [])

  async function fetchTeam() {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/team`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setTeam(data.team || [])
      }
    } catch (err) {
      console.error('Failed to fetch team:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteEmployee(userId, userName) {
    if (!window.confirm(
      `Delete employee "${userName}" and all their calls?`
    )) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/employee/${userId}`,
        {
          method:  'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (response.ok) {
        alert('Employee deleted!')
        fetchTeam()
      }
    } catch (err) {
      alert('Delete failed!')
    }
  }

  const scoreColor = (score) =>
    score >= 8 ? '#16a34a' :
    score >= 5 ? '#d97706' : '#dc2626'

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#666', marginTop: '16px' }}>
          Loading team...
        </p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>
              👥 Team Management
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Manage your team members and their performance
            </p>
          </div>
          <button
            onClick={fetchTeam}
            style={{
              backgroundColor: '#4361ee',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              TOTAL MEMBERS
            </p>
            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#4361ee'
            }}>
              {team.length}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              TOTAL CALLS
            </p>
            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#16a34a'
            }}>
              {team.reduce((sum, m) => sum + m.total_calls, 0)}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              TEAM AVG SCORE
            </p>
            <p style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#d97706'
            }}>
              {team.length === 0 ? 0 : Math.round(
                team.reduce((sum, m) => sum + m.avg_score, 0)
                / team.length
              )}
            </p>
          </div>
        </div>

        {/* Team Members List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            color: '#1a1a2e',
            marginBottom: '20px'
          }}>
            👥 Team Members
          </h2>

          {team.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999'
            }}>
              <p style={{ fontSize: '48px' }}>👥</p>
              <p style={{ marginTop: '10px' }}>
                No team members yet!
              </p>
              <p style={{
                fontSize: '14px',
                marginTop: '8px'
              }}>
                Share your org code with employees
                so they can join!
              </p>
            </div>
          ) : (
            team.map((member) => (
              <div
                key={member.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                {/* Left - Member Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    backgroundColor:
                      member.role === 'admin'
                        ? '#4361ee' : '#16a34a',
                    color: 'white',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{
                      fontWeight: '700',
                      color: '#1a1a2e',
                      fontSize: '16px'
                    }}>
                      {member.name}
                    </p>
                    <p style={{
                      color: '#666',
                      fontSize: '13px'
                    }}>
                      {member.email}
                    </p>
                    <span style={{
                      backgroundColor:
                        member.role === 'admin'
                          ? '#f0f4ff' : '#f0fff4',
                      color:
                        member.role === 'admin'
                          ? '#4361ee' : '#16a34a',
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Middle - Stats */}
                <div style={{
                  display: 'flex',
                  gap: '32px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      color: '#666',
                      fontSize: '11px'
                    }}>
                      CALLS
                    </p>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '28px',
                      color: '#4361ee'
                    }}>
                      {member.total_calls}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      color: '#666',
                      fontSize: '11px'
                    }}>
                      AVG SCORE
                    </p>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '28px',
                      color: scoreColor(member.avg_score)
                    }}>
                      {member.avg_score}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{
                      color: '#666',
                      fontSize: '11px'
                    }}>
                      POSITIVE
                    </p>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '28px',
                      color: '#16a34a'
                    }}>
                      {member.positive_calls}
                    </p>
                  </div>
                </div>

                {/* Right - Actions */}
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => navigate(
                      '/dashboard'
                    )}
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
                    View Calls
                  </button>

                  {/* Cannot delete own account or other admins */}
                  {member.role !== 'admin' && (
                    <button
                      onClick={() => handleDeleteEmployee(
                        member.id,
                        member.name
                      )}
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
                      🗑️ Remove
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default TeamPage