// DashboardPage.jsx
// Beautiful dashboard with charts!

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCalls, deleteCall } from '../utils/storage'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

function DashboardPage() {

  const navigate    = useNavigate()
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

  // ── Calculate Statistics ──────────────────────

  const totalCalls = calls.length

  // Average score
  const avgScore = totalCalls === 0 ? 0 :
    Math.round(
      calls.reduce((sum, c) => sum + (c.parsed?.score || 0), 0)
      / totalCalls
    )

  // Count positive calls
  const positiveCalls = calls.filter(
    c => c.parsed?.sentiment === 'positive'
  ).length

  // ── Chart Data ────────────────────────────────

  // Score over time (reversed so oldest first)
  const scoreData = [...calls].reverse().map((call, index) => ({
    name:  `Call ${index + 1}`,
    score: call.parsed?.score || 0,
    file:  call.filename
  }))

  // Sentiment breakdown for pie chart
  const sentimentCounts = {
    positive: calls.filter(c => c.parsed?.sentiment === 'positive').length,
    neutral:  calls.filter(c => c.parsed?.sentiment === 'neutral').length,
    negative: calls.filter(c => c.parsed?.sentiment === 'negative').length,
  }

  const pieData = [
    { name: 'Positive', value: sentimentCounts.positive },
    { name: 'Neutral',  value: sentimentCounts.neutral  },
    { name: 'Negative', value: sentimentCounts.negative },
  ].filter(d => d.value > 0)

  const PIE_COLORS = ['#16a34a', '#d97706', '#dc2626']

  // Score color helper
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
          marginBottom: '24px'
        }}>

          {/* Total Calls */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              TOTAL CALLS
            </p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#4361ee'
            }}>
              {totalCalls}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>
              calls analyzed
            </p>
          </div>

          {/* Average Score */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              AVERAGE SCORE
            </p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: scoreColor(avgScore)
            }}>
              {avgScore}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>
              out of 10
            </p>
          </div>

          {/* Positive Calls */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '13px' }}>
              POSITIVE CALLS
            </p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#16a34a'
            }}>
              {positiveCalls}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>
              out of {totalCalls}
            </p>
          </div>

        </div>

        {/* Charts Row */}
        {totalCalls > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>

            {/* Score Over Time Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#1a1a2e',
                marginBottom: '20px',
                fontSize: '16px'
              }}>
                📈 Score Over Time
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}/10`, 'Score']}
                    labelStyle={{ color: '#1a1a2e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4361ee"
                    strokeWidth={3}
                    dot={{ fill: '#4361ee', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Pie Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{
                color: '#1a1a2e',
                marginBottom: '20px',
                fontSize: '16px'
              }}>
                🥧 Sentiment
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

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

          {/* Empty state */}
          {calls.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999'
            }}>
              <p style={{ fontSize: '48px' }}>📭</p>
              <p style={{ marginTop: '10px' }}>
                No calls analyzed yet!
              </p>
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

          {/* Calls */}
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
                alignItems: 'center'
              }}
            >

              {/* Left - Call Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <span style={{ fontSize: '32px' }}>🎙️</span>
                <div>
                  <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
  {call.filename}
</p>
<p style={{ color: '#4361ee', fontSize: '13px', fontWeight: '600' }}>
  👤 {call.salesperson_name}
</p>
<p style={{ color: '#666', fontSize: '13px' }}>
  {call.date} at {call.time} •
  {call.size_mb} MB •
  {call.language}
</p>
                </div>
              </div>

              {/* Middle - Score Badge */}
              <div style={{
                backgroundColor: '#f8faff',
                borderRadius: '10px',
                padding: '8px 16px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#666', fontSize: '11px' }}>SCORE</p>
                <p style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: scoreColor(call.parsed?.score || 0)
                }}>
                  {call.parsed?.score || 'N/A'}
                </p>
              </div>

              {/* Right - Buttons */}
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