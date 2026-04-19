// AnalysisPage.jsx
// Shows detailed AI analysis of uploaded call

import { useLocation, useNavigate } from 'react-router-dom'

function AnalysisPage() {

  // useLocation gets data passed from UploadPage
  const location = useLocation()

  // useNavigate lets us go to other pages
  const navigate = useNavigate()

  // Get our analysis data
  const result = location.state?.result

  // If no data found → go back to upload page
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
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          ← Go to Upload Page
        </button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>

      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        maxWidth: '900px',
        margin: '0 auto 30px auto'
      }}>
        <h1 style={{ color: '#1a1a2e', fontSize: '24px' }}>
          🎙️ AI Sales Call Analyzer
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'white',
              color: '#4361ee',
              padding: '8px 16px',
              border: '1px solid #4361ee',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← New Upload
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#4361ee',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Dashboard →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>

        {/* Call Info Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
            📋 Call Information
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px'
          }}>
            {/* File Name */}
            <div style={{
              backgroundColor: '#f8faff',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <p style={{ color: '#666', fontSize: '12px' }}>FILE NAME</p>
              <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
                📁 {result.filename}
              </p>
            </div>
            {/* File Size */}
            <div style={{
              backgroundColor: '#f8faff',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <p style={{ color: '#666', fontSize: '12px' }}>FILE SIZE</p>
              <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
                📦 {result.size_mb} MB
              </p>
            </div>
            {/* Language */}
            <div style={{
              backgroundColor: '#f8faff',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <p style={{ color: '#666', fontSize: '12px' }}>LANGUAGE</p>
              <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
                🌐 {result.language}
              </p>
            </div>
          </div>
        </div>

        {/* Transcript Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
            📝 Call Transcript
          </h2>
          <div style={{
            backgroundColor: '#f8faff',
            borderRadius: '10px',
            padding: '20px',
            lineHeight: '1.8',
            color: '#334155',
            fontSize: '15px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {result.transcript}
          </div>
        </div>

        {/* AI Analysis Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
            🤖 AI Coaching Analysis
          </h2>
          <div style={{
            backgroundColor: '#fdf4ff',
            border: '1px solid #e9d5ff',
            borderRadius: '10px',
            padding: '20px',
            lineHeight: '1.8',
            color: '#334155',
            fontSize: '15px',
            whiteSpace: 'pre-line'
          }}>
            {result.analysis}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginTop: '10px'
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