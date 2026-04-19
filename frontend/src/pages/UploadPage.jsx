// UploadPage.jsx
// Now connected to our FastAPI backend!

import { useState } from 'react'

function UploadPage() {

  // Memory boxes (states)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging]     = useState(false)
  const [isUploading, setIsUploading]   = useState(false) // loading state
  const [result, setResult]             = useState(null)  // stores response
  const [error, setError]               = useState(null)  // stores errors

  // When user picks file normally
  function handleFileChange(event) {
    const file = event.target.files[0]
    setSelectedFile(file)
    setResult(null)  // clear old results
    setError(null)   // clear old errors
  }

  // When user drags file OVER the box
  function handleDragOver(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  // When user drags file AWAY
  function handleDragLeave() {
    setIsDragging(false)
  }

  // When user DROPS file
  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    setSelectedFile(file)
    setResult(null)
    setError(null)
  }

  // When user clicks Upload & Analyze button
  // This is the MAIN function that talks to backend
  async function handleUpload() {

    // Check if file is selected
    if (!selectedFile) {
      alert('Please select a file first!')
      return
    }

    try {
      // Show loading state
      setIsUploading(true)
      setError(null)

      // FormData is like a container to send files
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Send file to our FastAPI backend
      // fetch() is like a messenger that sends data
      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',   // POST means we are sending data
        body: formData    // The file we are sending
      })

      // Convert response to JSON
      const data = await response.json()

      // Check if something went wrong
      if (!response.ok) {
        setError(data.detail || 'Upload failed!')
        return
      }

      // Save result in our memory box
      setResult(data)

    } catch (err) {
      // If backend is not running or network error
      setError('Cannot connect to backend. Is it running?')
    } finally {
      // Always stop loading whether success or fail
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

        {/* Drag and Drop Box */}
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

          {/* Hidden file input */}
          <input
            type="file"
            accept=".mp3,.wav,.m4a,.flac"
            onChange={handleFileChange}
            id="fileInput"
            style={{ display: 'none' }}
          />

          {/* Browse button */}
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

        {/* Selected file info */}
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
          {/* Button text changes based on state */}
          {isUploading ? '⏳ Uploading...' : '🚀 Upload & Analyze'}
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

        {/* Success Result */}
{result && (
  <div style={{ marginTop: '16px' }}>

    {/* Success Header */}
    <div style={{
      backgroundColor: '#f0fff4',
      border: '1px solid #86efac',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '16px'
    }}>
      <p style={{ color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
        ✅ Analysis Complete!
      </p>
      <p style={{ color: '#166534', fontSize: '14px' }}>
        📁 File: {result.filename}
      </p>
      <p style={{ color: '#166534', fontSize: '14px' }}>
        📦 Size: {result.size_mb} MB
      </p>
      <p style={{ color: '#166534', fontSize: '14px' }}>
        🌐 Language: {result.language}
      </p>
    </div>

    {/* Transcript Box */}
    <div style={{
      backgroundColor: '#f8faff',
      border: '1px solid #c7d7fd',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <p style={{
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: '10px',
        fontSize: '15px'
      }}>
        📝 Transcript
      </p>
      <p style={{
        color: '#334155',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        {result.transcript}
      </p>
    </div>

    {/* AI Analysis Box */}
    <div style={{
      backgroundColor: '#fdf4ff',
      border: '1px solid #e9d5ff',
      borderRadius: '10px',
      padding: '16px'
    }}>
      <p style={{
        fontWeight: '700',
        color: '#6b21a8',
        marginBottom: '10px',
        fontSize: '15px'
      }}>
        🤖 AI Coaching Analysis
      </p>
      <p style={{
        color: '#334155',
        fontSize: '14px',
        lineHeight: '1.8',
        whiteSpace: 'pre-line'
      }}>
        {result.analysis}
      </p>
    </div>

  </div>
)}
      </div>

      {/* Bottom note */}
      <p style={{ marginTop: '24px', color: '#999', fontSize: '13px' }}>
        Your calls are private and secure 🔒
      </p>

    </div>
  )
}

export default UploadPage