// AnalysisPage.jsx
// Beautiful structured analysis page

import { useLocation, useNavigate } from 'react-router-dom'

function AnalysisPage() {

  const location = useLocation()
  const navigate = useNavigate()
  const result   = location.state?.result

  // If no data found
  if (!result) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>No Analysis Found!</h2>
        <p style={{ color: '#666', margin: '10px 0' }}>
          Please upload a call first
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
          ← Go to Upload Page
        </button>
      </div>
    )
  }

  // Get parsed data
  // If no parsed data use empty defaults
  const parsed = result.parsed || {}
  console.log("PARSED DATA:", parsed)
console.log("FULL RESULT:", result)
  const sentiment  = parsed.sentiment    || 'neutral'
  const score      = parsed.score        || 0
  const objections = parsed.objections   || []
  const strengths  = parsed.strengths    || []
  const weaknesses = parsed.weaknesses   || []
  const tips       = parsed.tips         || []
  const summary    = parsed.summary      || result.analysis
  const mood       = parsed.customer_mood || 'Not available'

  // Sentiment color
  const sentimentColor = 
    sentiment === 'positive' ? '#16a34a' :
    sentiment === 'negative' ? '#dc2626' : '#d97706'

  const sentimentBg = 
    sentiment === 'positive' ? '#f0fff4' :
    sentiment === 'negative' ? '#fff0f0' : '#fffbeb'

  const sentimentEmoji =
    sentiment === 'positive' ? '😊' :
    sentiment === 'negative' ? '😟' : '😐'

  // Score color
  const scoreColor =
    score >= 8 ? '#16a34a' :
    score >= 5 ? '#d97706' : '#dc2626'

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Page Title */}
        <h2 style={{
          color: '#1a1a2e',
          marginBottom: '24px',
          fontSize: '22px'
        }}>
          📊 Call Analysis Report
        </h2>

        {/* Top Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>

          {/* Score Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
              PERFORMANCE SCORE
            </p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: scoreColor
            }}>
              {score}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>out of 10</p>
          </div>

          {/* Sentiment Card */}
          <div style={{
            backgroundColor: sentimentBg,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
              SENTIMENT
            </p>
            <p style={{ fontSize: '40px' }}>{sentimentEmoji}</p>
            <p style={{
              color: sentimentColor,
              fontWeight: '700',
              fontSize: '16px',
              textTransform: 'capitalize'
            }}>
              {sentiment}
            </p>
          </div>

          {/* Objections Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
              OBJECTIONS FOUND
            </p>
            <p style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: objections.length > 0 ? '#dc2626' : '#16a34a'
            }}>
              {objections.length}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>objections</p>
          </div>

        </div>

        {/* Customer Mood */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#666', fontSize: '13px' }}>CUSTOMER MOOD</p>
          <p style={{ color: '#1a1a2e', fontSize: '15px', marginTop: '6px' }}>
            💭 {mood}
          </p>
        </div>

        {/* Strengths and Weaknesses */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>

          {/* Strengths */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#16a34a', marginBottom: '16px' }}>
              💪 Strengths
            </h3>
            {strengths.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>
                No strengths found
              </p>
            ) : (
              strengths.map((strength, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <p style={{ color: '#334155', fontSize: '14px' }}>
                    {strength}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Weaknesses */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ color: '#dc2626', marginBottom: '16px' }}>
              ⚠️ Weaknesses
            </h3>
            {weaknesses.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>
                No weaknesses found
              </p>
            ) : (
              weaknesses.map((weakness, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <span style={{ color: '#dc2626' }}>✗</span>
                  <p style={{ color: '#334155', fontSize: '14px' }}>
                    {weakness}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Objections List */}
        {objections.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#dc2626', marginBottom: '16px' }}>
              🚫 Customer Objections
            </h3>
            {objections.map((objection, index) => (
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
            ))}
          </div>
        )}

        {/* Coaching Tips */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#4361ee', marginBottom: '16px' }}>
            🎯 Coaching Tips
          </h3>
          {tips.length === 0 ? (
            <p style={{ color: '#999', fontSize: '14px' }}>
              No tips available
            </p>
          ) : (
            tips.map((tip, index) => (
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
                <p style={{ color: '#334155', fontSize: '14px', lineHeight: '1.6' }}>
                  {tip}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '12px' }}>
            📋 Summary
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            lineHeight: '1.8'
          }}>
            {summary}
          </p>
        </div>

        {/* Transcript */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
            📝 Full Transcript
          </h3>
          <div style={{
            backgroundColor: '#f8faff',
            borderRadius: '10px',
            padding: '20px',
            lineHeight: '1.8',
            color: '#334155',
            fontSize: '14px',
            maxHeight: '250px',
            overflowY: 'auto'
          }}>
            {result.transcript}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'white',
              color: '#4361ee',
              padding: '14px 32px',
              border: '2px solid #4361ee',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            ← Analyze Another Call
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#4361ee',
              color: 'white',
              padding: '14px 32px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            View Dashboard →
          </button>
        </div>

      </div>
    </div>
  )
}

export default AnalysisPage