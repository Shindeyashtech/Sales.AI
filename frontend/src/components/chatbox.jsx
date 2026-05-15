// Chatbot.jsx
// AI powered chatbot for Sales.AI website

import { useState, useRef, useEffect } from 'react'

function Chatbot({ onClose }) {

  const [messages,  setMessages]  = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m Sales.AI assistant! Ask me anything about our platform, features, pricing, or how to get started!'
    }
  ])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const messagesEndRef             = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }])

    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        }
      )

      const data = await response.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'Sorry I could not understand that!'
      }])

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error. Please try again!'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      width: '360px',
      height: '500px',
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(124,58,237,0.25)',
      border: '1px solid rgba(124,58,237,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🤖
          </div>
          <div>
            <p style={{
              color: 'white',
              fontWeight: '700',
              fontSize: '15px'
            }}>
              Sales.AI Assistant
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '11px'
            }}>
              🟢 Online — Powered by AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#faf9ff'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                : 'white',
              color: msg.role === 'user' ? 'white' : '#1a1a2e',
              fontSize: '14px',
              lineHeight: '1.5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: msg.role === 'assistant'
                ? '1px solid rgba(124,58,237,0.1)'
                : 'none'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', gap: '4px', padding: '8px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#7c3aed',
                animation: `bounce 0.6s ${i * 0.1}s infinite alternate`
              }} />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div style={{
        padding: '8px 16px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0'
      }}>
        {[
          'What is Sales.AI?',
          'How does it work?',
          'Is it free?',
          'How to join?'
        ].map((q) => (
          <button
            key={q}
            onClick={() => {
              setInput(q)
            }}
            style={{
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              border: '1px solid #ede9fe',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'white',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '2px solid #ede9fe',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
            color: '#1a1a2e'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            width: '44px',
            height: '44px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          ➤
        </button>
      </div>

    </div>
  )
}

export default Chatbot