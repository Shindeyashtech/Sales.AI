// CoachingPage.jsx
// Shows coaching plan for all salespersons

// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getCalls } from '../utils/storage'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
function CoachingPage() {
  const navigate = useNavigate()
  const token    = useAuthStore(state => state.token)

  const [calls, setCalls]                 = useState([])
  const [selectedPerson, setSelectedPerson] = useState('All')
  const [loading, setLoading]            = useState(true)


useEffect(() => {
  fetchCalls()
}, [])

async function fetchCalls() {
  try {
    setLoading(true)
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/calls`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
      const data = await response.json()
      setCalls(data.calls || [])
    }
  } catch (err) {
    console.error('Failed to fetch calls:', err)
  } finally {
    setLoading(false)
  }
}

  // Get unique salesperson names
  const salespeople = [
    'All',
    ...new Set(calls.map(c => c.salesperson_name || 'Unknown'))
  ]

  // Filter calls by selected person
  const filteredCalls = selectedPerson === 'All'
    ? calls
    : calls.filter(c => c.salesperson_name === selectedPerson)

  // Calculate person stats
  function getPersonStats(personCalls) {
    if (personCalls.length === 0) return null

    const avgScore = Math.round(
      personCalls.reduce((sum, c) => sum + (c.parsed?.score || 0), 0)
      / personCalls.length
    )

    const allStrengths = personCalls
      .flatMap(c => c.parsed?.strengths || [])

    const allWeaknesses = personCalls
      .flatMap(c => c.parsed?.weaknesses || [])

    const allTips = personCalls
      .flatMap(c => c.parsed?.tips || [])

    const allObjections = personCalls
      .flatMap(c => c.parsed?.objections || [])

    const positiveCalls = personCalls
      .filter(c => c.parsed?.sentiment === 'positive').length

    return {
      avgScore,
      allStrengths,
      allWeaknesses,
      allTips,
      allObjections,
      positiveCalls,
      totalCalls: personCalls.length
    }
  }

  const stats = getPersonStats(filteredCalls)

  // Score color
  const scoreColor = (score) =>
    score >= 8 ? '#16a34a' :
    score >= 5 ? '#d97706' : '#dc2626'

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
              🎯 Coaching Center
            </h1>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>
              Personalized improvement plans for your team
            </p>
          </div>
         
        </div>

        {/* No calls state */}
        {calls.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <p style={{ fontSize: '48px' }}>📭</p>
            <h3 style={{ color: '#1a1a2e', marginTop: '16px' }}>
              No calls analyzed yet!
            </h3>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Upload calls to see coaching plans
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '20px',
                backgroundColor: '#4361ee',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Upload First Call
            </button>
          </div>
        )}

        {calls.length > 0 && (
          <>
            {/* Person Filter */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              marginBottom: '24px'
            }}>
              <p style={{
                color: '#666',
                fontSize: '13px',
                marginBottom: '12px'
              }}>
                SELECT SALESPERSON
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {salespeople.map((person) => (
                  <button
                    key={person}
                    onClick={() => setSelectedPerson(person)}
                    style={{
                      backgroundColor: selectedPerson === person
                        ? '#4361ee' : '#f0f2f5',
                      color: selectedPerson === person
                        ? 'white' : '#334155',
                      padding: '8px 18px',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {person === 'All' ? '👥 All' : `👤 ${person}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '16px',
                marginBottom: '24px'
              }}>

                {/* Avg Score */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    AVG SCORE
                  </p>
                  <p style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: scoreColor(stats.avgScore)
                  }}>
                    {stats.avgScore}
                  </p>
                </div>

                {/* Total Calls */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    TOTAL CALLS
                  </p>
                  <p style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#4361ee'
                  }}>
                    {stats.totalCalls}
                  </p>
                </div>

                {/* Positive Calls */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    POSITIVE CALLS
                  </p>
                  <p style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#16a34a'
                  }}>
                    {stats.positiveCalls}
                  </p>
                </div>

                {/* Objections */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    TOTAL OBJECTIONS
                  </p>
                  <p style={{
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#dc2626'
                  }}>
                    {stats.allObjections.length}
                  </p>
                </div>

              </div>
            )}

            {/* Improvement Plan */}
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px'
              }}>

                {/* Top Strengths */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{
                    color: '#16a34a',
                    marginBottom: '16px'
                  }}>
                    💪 Common Strengths
                  </h3>
                  {stats.allStrengths.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>
                      No data yet
                    </p>
                  ) : (
                    // Show unique strengths
                    [...new Set(stats.allStrengths)]
                      .slice(0, 5)
                      .map((strength, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#f0fff4',
                          padding: '10px',
                          borderRadius: '8px'
                        }}>
                          <span style={{ color: '#16a34a' }}>✓</span>
                          <p style={{
                            color: '#334155',
                            fontSize: '14px'
                          }}>
                            {strength}
                          </p>
                        </div>
                      ))
                  )}
                </div>

                {/* Areas To Improve */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                }}>
                  <h3 style={{
                    color: '#dc2626',
                    marginBottom: '16px'
                  }}>
                    ⚠️ Areas To Improve
                  </h3>
                  {stats.allWeaknesses.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>
                      No data yet
                    </p>
                  ) : (
                    [...new Set(stats.allWeaknesses)]
                      .slice(0, 5)
                      .map((weakness, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#fff0f0',
                          padding: '10px',
                          borderRadius: '8px'
                        }}>
                          <span style={{ color: '#dc2626' }}>✗</span>
                          <p style={{
                            color: '#334155',
                            fontSize: '14px'
                          }}>
                            {weakness}
                          </p>
                        </div>
                      ))
                  )}
                </div>

              </div>
            )}

            {/* Coaching Tips */}
            {stats && stats.allTips.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  color: '#4361ee',
                  marginBottom: '16px'
                }}>
                  🎯 Coaching Action Plan
                </h3>
                {[...new Set(stats.allTips)]
                  .slice(0, 6)
                  .map((tip, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '14px',
                      backgroundColor: '#f8faff',
                      borderRadius: '10px',
                      padding: '14px'
                    }}>
                      <div style={{
                        backgroundColor: '#4361ee',
                        color: 'white',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <p style={{
                        color: '#334155',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}>
                        {tip}
                      </p>
                    </div>
                  ))
                }
              </div>
            )}

            {/* Common Objections */}
            {stats && stats.allObjections.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  color: '#dc2626',
                  marginBottom: '16px'
                }}>
                  🚫 Common Customer Objections
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}>
                  These objections come up most often.
                  Prepare responses for them!
                </p>
                {[...new Set(stats.allObjections)]
                  .slice(0, 5)
                  .map((objection, index) => (
                    <div key={index} style={{
                      backgroundColor: '#fff0f0',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      color: '#dc2626',
                      fontSize: '14px'
                    }}>
                      {index + 1}. {objection}
                    </div>
                  ))
                }
              </div>
            )}

            {/* Recent Calls List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#1a1a2e',
                marginBottom: '16px'
              }}>
                📋 Recent Calls
              </h3>
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: '#1a1a2e'
                    }}>
                      🎙️ {call.filename}
                    </p>
                    <p style={{
                      color: '#4361ee',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      👤 {call.salesperson_name || 'Unknown'}
                    </p>
                    <p style={{
                      color: '#666',
                      fontSize: '13px'
                    }}>
                     {call.uploaded_at 
  ? new Date(call.uploaded_at).toLocaleDateString() 
  : call.date} • {call.language}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        color: '#666',
                        fontSize: '11px'
                      }}>
                        SCORE
                      </p>
                      <p style={{
                        fontWeight: 'bold',
                        fontSize: '24px',
                        color: scoreColor(call.parsed?.score || 0)
                      }}>
                        {call.parsed?.score || 'N/A'}
                      </p>
                    </div>
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
export default CoachingPage