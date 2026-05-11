// import { useState } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveCall } from '../utils/storage'
import useAuthStore from '../store/authStore'
function UploadPage() {

  const navigate = useNavigate()
  const token = useAuthStore(state => state.token)
  const user  = useAuthStore(state => state.user)

// Redirect admin away from upload page
useEffect(() => {
  if (user?.role === 'admin') {
    navigate('/dashboard')
  }
}, [user])
  const [selectedFile, setSelectedFile] = useState(null)
  const [salesName, setSalesName] = useState('')
  const [isDragging, setIsDragging]     = useState(false)
  const [isUploading, setIsUploading]   = useState(false)
  const [error, setError]               = useState(null)

  function handleFileChange(event) {
    const file = event.target.files[0]
    setSelectedFile(file)
    setError(null)
  }

  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    setSelectedFile(file)
    setError(null)
  }

  async function handleUpload() {
  if (!selectedFile) {
    alert('Please select a file first!')
    return
  }

  if (!salesName.trim()) {
    alert('Please enter salesperson name!')
    return
  }

    try {
      setIsUploading(true)
      setError(null)

      const formData = new FormData()
formData.append('file', selectedFile)
formData.append('salesperson_name', salesName)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Upload failed!')
        return
      }
// Save call to localStorage
const savedCall = saveCall(data)

// Navigate to analysis page with result data
navigate('/analysis', { state: { result: data, callId: savedCall.id } })

    } catch (err) {
      setError('Cannot connect to backend. Is it running?')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1a1a2e'
        }}>
          🎙️ AI Sales Call Analyzer
        </h1>
        <p style={{ color: '#666', marginTop: '10px', fontSize: '16px' }}>
          Upload your sales call and get instant AI coaching feedback
        </p>
      </div>

      {/* Upload Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>

        <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
          Upload Sales Call
        </h2>
{/* Salesperson Name Input */}
<div style={{ marginBottom: '20px' }}>
  <label style={{
    display: 'block',
    color: '#334155',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px'
  }}>
    👤 Salesperson Name
  </label>
  <input
    type="text"
    placeholder="Enter salesperson name..."
    value={salesName}
    onChange={(e) => setSalesName(e.target.value)}
    style={{
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '14px',
      outline: 'none',
      color: '#1a1a2e',
      boxSizing: 'border-box'
    }}
  />
</div>
        {/* Drag Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #4361ee' : '2px dashed #ccc',
            backgroundColor: isDragging ? '#f0f4ff' : '#fafafa',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>

          <p style={{ fontWeight: '600', color: '#333', marginBottom: '6px' }}>
            Drag & Drop your audio file here
          </p>

          <p style={{ color: '#999', fontSize: '13px', marginBottom: '16px' }}>
            or click below to browse
          </p>

          <input
            type="file"
            accept=".mp3,.wav,.m4a,.flac"
            onChange={handleFileChange}
            id="fileInput"
            style={{ display: 'none' }}
          />

          <label htmlFor="fileInput" style={{
            backgroundColor: '#4361ee',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Browse File
          </label>

          <p style={{ color: '#bbb', fontSize: '12px', marginTop: '16px' }}>
            Supported: MP3, WAV, M4A, FLAC (Max 100MB)
          </p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div style={{
            marginTop: '20px',
            backgroundColor: '#f0fff4',
            border: '1px solid #86efac',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🎵</span>
            <div>
              <p style={{ fontWeight: '600', color: '#166534', fontSize: '14px' }}>
                {selectedFile.name}
              </p>
              <p style={{ color: '#16a34a', fontSize: '12px' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={{
            width: '100%',
            marginTop: '24px',
            backgroundColor: isUploading ? '#94a3b8' : '#4361ee',
            color: 'white',
            padding: '14px',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isUploading ? 'not-allowed' : 'pointer'
          }}
        >
          {isUploading ? '⏳ Analyzing... Please wait' : '🚀 Upload & Analyze'}
          {/* Loading Animation */}
{isUploading && (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <div className="spinner"></div>
    <p style={{ color: '#666', fontSize: '14px' }}>
      🎙️ Transcribing audio...
    </p>
    <p style={{ color: '#999', fontSize: '12px', marginTop: '6px' }}>
      This may take 2-4 minutes ⏳
    </p>
  </div>
)}
        </button>

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '16px',
            backgroundColor: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '14px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

      </div>

      {/* Bottom Note */}
      <p style={{ marginTop: '24px', color: '#999', fontSize: '13px' }}>
        Your calls are private and secure 🔒
      </p>

    </div>
  )
}

export default UploadPage