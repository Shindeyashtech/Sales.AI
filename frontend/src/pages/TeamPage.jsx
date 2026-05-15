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
    if (user?.role !== 'admin') { navigate('/'); return }
    fetchTeam()
  }, [])

  async function fetchTeam() {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/team`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) {
        const data = await response.json()
        // Filter only employees!
        const employees = (data.team || []).filter(
          m => m.role === 'employee'
        )
        setTeam(employees)
      }
    } catch (err) {
      console.error('Failed:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteEmployee(userId, userName) {
    if (!window.confirm(`Delete "${userName}" and all their calls?`)) return
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/admin/employee/${userId}`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (response.ok) { alert('Employee deleted!'); fetchTeam() }
    } catch (err) { alert('Delete failed!') }
  }

  const scoreColor = (score) =>
    score >= 8 ? '#16a34a' :
    score >= 5 ? '#d97706' : '#dc2626'

  // Stats calculated from employees only
  const totalCalls  = team.reduce((sum, m) => sum + m.total_calls, 0)
  const totalMembers = team.length
  const avgScore    = totalMembers === 0 ? 0 : Math.round(
    team.reduce((sum, m) => sum + m.avg_score, 0) / totalMembers
  )

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8f7ff, #fdf4ff)'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#7c3aed', marginTop: '16px' }}>Loading team...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f7ff, #fdf4ff)',
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
            <h1 style={{
              fontSize: '26px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              👥 Team Management
            </h1>
            <p style={{ color: '#7c3aed', fontSize: '14px', marginTop: '4px' }}>
              Manage your sales team performance
            </p>
          </div>
          <button
            onClick={fetchTeam}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(124,58,237,0.3)'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Row - ONLY employees counted */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>

          {/* Total Members (employees only) */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>TOTAL MEMBERS</p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {totalMembers}
            </p>
            <p style={{ color: '#999', fontSize: '12px' }}>employees</p>
          </div>

          {/* Total Calls */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>TOTAL CALLS</p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#16a34a'
            }}>
              {totalCalls}
            </p>
            <p style={{ color: '#999', fontSize: '12px' }}>analyzed</p>
          </div>

          {/* Team Avg Score */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>TEAM AVG SCORE</p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: scoreColor(avgScore)
            }}>
              {avgScore}
            </p>
            <p style={{ color: '#999', fontSize: '12px' }}>out of 10</p>
          </div>

        </div>

        {/* Team Members List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.08)'
        }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>
            👥 Team Members
          </h2>

          {/* Empty state */}
          {team.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p style={{ fontSize: '48px' }}>👥</p>
              <p style={{ marginTop: '10px', fontSize: '16px' }}>No employees yet!</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#a78bfa' }}>
                Share your org code with employees so they can join!
              </p>
            </div>
          )}

          {/* Employee cards */}
          {team.map((member) => (
            <div
              key={member.id}
              style={{
                border: '1px solid rgba(124,58,237,0.1)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s',
                backgroundColor: '#faf9ff'
              }}
            >
              {/* Left - Member Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
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
                  <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                    {member.name}
                  </p>
                  <p style={{ color: '#666', fontSize: '13px' }}>
                    {member.email}
                  </p>
                  <span style={{
                    backgroundColor: '#f5f3ff',
                    color: '#7c3aed',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    EMPLOYEE
                  </span>
                </div>
              </div>

              {/* Middle - Stats */}
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#666', fontSize: '11px' }}>CALLS</p>
                  <p style={{ fontWeight: 'bold', fontSize: '28px', color: '#7c3aed' }}>
                    {member.total_calls}
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#666', fontSize: '11px' }}>AVG SCORE</p>
                  <p style={{ fontWeight: 'bold', fontSize: '28px', color: scoreColor(member.avg_score) }}>
                    {member.avg_score}
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#666', fontSize: '11px' }}>POSITIVE</p>
                  <p style={{ fontWeight: 'bold', fontSize: '28px', color: '#16a34a' }}>
                    {member.positive_calls}
                  </p>
                </div>
              </div>

              {/* Right - Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  View Calls
                </button>
                <button
                  onClick={() => handleDeleteEmployee(member.id, member.name)}
                  style={{
                    backgroundColor: '#fff1f2',
                    color: '#e11d48',
                    padding: '8px 16px',
                    border: '1px solid #fecdd3',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  🗑️ Remove
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default TeamPage