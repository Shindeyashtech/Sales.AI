// AnalysisPage.jsx
// Beautiful analysis page with charts!
import { useLocation, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell
} from 'recharts'

function AnalysisPage() {

   const location    = useLocation()
const navigate    = useNavigate()
const result      = location.state?.result
const reportRef   = useRef(null)
const [exporting, setExporting] = useState(false)

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
          Go to Upload Page
        </button>
      </div>
    )
  }
// PDF Export function
async function handleExportPDF() {
  try {
    setExporting(true)

    // Get the report div
    const reportElement = reportRef.current

    // Take screenshot of entire report
    const canvas = await html2canvas(reportElement, {
      scale: 2,           // higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#f0f2f5'
    })

    // Convert to image
    const imgData = canvas.toDataURL('image/png')

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // A4 dimensions
    const pdfWidth  = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Calculate image dimensions
    const imgWidth  = canvas.width
    const imgHeight = canvas.height
    const ratio     = imgWidth / imgHeight
    const imgPDFHeight = pdfWidth / ratio

    // If content is longer than one page
    // split into multiple pages
    let heightLeft = imgPDFHeight
    let position   = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgPDFHeight)
    heightLeft -= pdfHeight

    // Add more pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgPDFHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgPDFHeight)
      heightLeft -= pdfHeight
    }

    // Save the PDF
    const fileName = `Sales_Report_${result.salesperson_name || 'Unknown'}_${result.filename}.pdf`
    pdf.save(fileName)

    console.log("PDF exported successfully!")

  } catch (error) {
    console.error("PDF export failed:", error)
    alert("PDF export failed. Please try again!")
  } finally {
    setExporting(false)
  }
}

  // Get parsed data
  const parsed     = result.parsed || {}
  const sentiment  = parsed.sentiment    || 'neutral'
  const score      = parsed.score        || 0
  const objections = parsed.objections   || []
  const strengths  = parsed.strengths    || []
  const weaknesses = parsed.weaknesses   || []
  const tips       = parsed.tips         || []
  const summary    = parsed.summary      || result.analysis
  const mood       = parsed.customer_mood || 'Not available'

  // Sentiment colors
  const sentimentColor =
    sentiment === 'positive' ? '#16a34a' :
    sentiment === 'negative' ? '#dc2626' : '#d97706'

  const sentimentBg =
    sentiment === 'positive' ? '#f0fff4' :
    sentiment === 'negative' ? '#fff0f0' : '#fffbeb'

  const sentimentEmoji =
    sentiment === 'positive' ? '😊' :
    sentiment === 'negative' ? '😟' : '😐'

  const scoreColor =
    score >= 8 ? '#16a34a' :
    score >= 5 ? '#d97706' : '#dc2626'

  // ── Chart Data ──────────────────────────────

  // Radar chart data
  // Shows multiple skills at once
  const radarData = [
    {
      skill: 'Score',
      value: score * 10  // convert to percentage
    },
    {
      skill: 'Strengths',
      value: Math.min(strengths.length * 25, 100)
    },
    {
      skill: 'Objections',
      // fewer objections = better score
      value: Math.max(100 - (objections.length * 25), 0)
    },
    {
      skill: 'Sentiment',
      value: sentiment === 'positive' ? 100 :
             sentiment === 'neutral'  ? 50  : 20
    },
    {
      skill: 'Tips Used',
      value: Math.min(tips.length * 33, 100)
    },
  ]

  // Bar chart data
  // Strengths vs Weaknesses
  const barData = [
    {
      name: 'Strengths',
      value: strengths.length,
      color: '#16a34a'
    },
    {
      name: 'Weaknesses',
      value: weaknesses.length,
      color: '#dc2626'
    },
    {
      name: 'Objections',
      value: objections.length,
      color: '#d97706'
    },
    {
      name: 'Tips',
      value: tips.length,
      color: '#4361ee'
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '30px 20px'
    }}>

<div ref={reportRef} style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Page Title */}
        <h2 style={{
          color: '#1a1a2e',
          marginBottom: '24px',
          fontSize: '22px'
        }}>
          📊 Call Analysis Report
        </h2>
        {/* Call Information Card */}
<div style={{
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  marginBottom: '20px'
}}>
  <h3 style={{ color: '#1a1a2e', marginBottom: '16px' }}>
    📋 Call Information
  </h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '16px'
  }}>

    {/* Salesperson */}
    <div style={{
      backgroundColor: '#f8faff',
      borderRadius: '10px',
      padding: '16px'
    }}>
      <p style={{ color: '#666', fontSize: '12px' }}>
        SALESPERSON
      </p>
      <p style={{ fontWeight: '600', color: '#4361ee' }}>
        👤 {result.salesperson_name || 'Unknown'}
      </p>
    </div>

    {/* File Name */}
    <div style={{
      backgroundColor: '#f8faff',
      borderRadius: '10px',
      padding: '16px'
    }}>
      <p style={{ color: '#666', fontSize: '12px' }}>
        FILE NAME
      </p>
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
      <p style={{ color: '#666', fontSize: '12px' }}>
        FILE SIZE
      </p>
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
      <p style={{ color: '#666', fontSize: '12px' }}>
        LANGUAGE
      </p>
      <p style={{ fontWeight: '600', color: '#1a1a2e' }}>
        🌐 {result.language}
      </p>
    </div>

  </div>
</div>
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
            <p style={{ color: '#666', fontSize: '12px' }}>
              PERFORMANCE SCORE
            </p>
            <p style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: scoreColor
            }}>
              {score}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>
              out of 10
            </p>
            {/* Score Label */}
<p style={{
  marginTop: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: scoreColor
}}>
  {score >= 8 ? '🌟 Excellent!'  :
   score >= 6 ? '👍 Good'        :
   score >= 4 ? '⚠️ Needs Work'  :
                '❌ Poor'}
</p>
            {/* Score Progress Bar */}
            <div style={{
              marginTop: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${score * 10}%`,
                backgroundColor: scoreColor,
                height: '100%',
                borderRadius: '10px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>

          {/* Sentiment Card */}
          <div style={{
            backgroundColor: sentimentBg,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '12px' }}>
              SENTIMENT
            </p>
            <p style={{ fontSize: '48px', margin: '8px 0' }}>
              {sentimentEmoji}
            </p>
            <p style={{
              color: sentimentColor,
              fontWeight: '700',
              fontSize: '18px',
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
            <p style={{ color: '#666', fontSize: '12px' }}>
              OBJECTIONS FOUND
            </p>
            <p style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: objections.length > 0 ? '#dc2626' : '#16a34a'
            }}>
              {objections.length}
            </p>
            <p style={{ color: '#999', fontSize: '13px' }}>
              objections
            </p>
          </div>

        </div>

        {/* ── CHARTS ROW ───────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px'
        }}>

          {/* Radar Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#1a1a2e',
              marginBottom: '16px',
              fontSize: '15px'
            }}>
              🕸️ Performance Radar
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#999' }}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#4361ee"
                  fill="#4361ee"
                  fillOpacity={0.3}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              color: '#1a1a2e',
              marginBottom: '16px',
              fontSize: '15px'
            }}>
              📊 Call Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Score Gauge Progress */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '20px' }}>
            🎯 Detailed Score Breakdown
          </h3>

          {/* Score bars for each metric */}
          {[
            {
              label: '⭐ Overall Score',
              value: score * 10,
              color: scoreColor
            },
            {
              label: '💪 Strengths',
              value: Math.min(strengths.length * 25, 100),
              color: '#16a34a'
            },
            {
              label: '😊 Sentiment',
              value: sentiment === 'positive' ? 100 :
                     sentiment === 'neutral'  ? 50  : 20,
              color: sentimentColor
            },
            {
              label: '🚫 Objection Control',
              value: Math.max(100 - objections.length * 25, 0),
              color: '#4361ee'
            },
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{ fontSize: '14px', color: '#334155' }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: item.color
                }}>
                  {item.value}%
                </span>
              </div>
              <div style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                height: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                  height: '100%',
                  borderRadius: '10px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Customer Mood */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#666', fontSize: '13px' }}>
            CUSTOMER MOOD
          </p>
          <p style={{
            color: '#1a1a2e',
            fontSize: '15px',
            marginTop: '6px'
          }}>
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
                  marginBottom: '10px',
                  backgroundColor: '#f0fff4',
                  padding: '10px',
                  borderRadius: '8px'
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
                  marginBottom: '10px',
                  backgroundColor: '#fff0f0',
                  padding: '10px',
                  borderRadius: '8px'
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

        {/* Objections */}
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
                <p style={{
                  color: '#334155',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
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
  justifyContent: 'center',
  marginBottom: '40px',
  flexWrap: 'wrap'
}}>
  {/* Analyze Another Call */}
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

  {/* Export PDF Button */}
  <button
    onClick={handleExportPDF}
    disabled={exporting}
    style={{
      backgroundColor: exporting ? '#94a3b8' : '#7209b7',
      color: 'white',
      padding: '14px 32px',
      border: 'none',
      borderRadius: '10px',
      cursor: exporting ? 'not-allowed' : 'pointer',
      fontSize: '15px',
      fontWeight: '600'
    }}
  >
    {exporting ? '⏳ Exporting...' : '📄 Export PDF'}
  </button>

  {/* View Dashboard */}
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