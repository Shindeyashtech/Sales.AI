// LandingPage.jsx
// Beautiful landing page for Sales.AI

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  const [activeFaq, setActiveFaq] = useState(null)

  const features = [
    {
      icon: '🎙️',
      title: 'AI Transcription',
      desc: 'Automatically convert any sales call audio into accurate text using advanced Whisper AI technology.',
    },
    {
      icon: '📊',
      title: 'Smart Analysis',
      desc: 'Get detailed insights on sentiment, objections, and performance scores for every call.',
    },
    {
      icon: '🎯',
      title: 'Coaching Tips',
      desc: 'Receive personalized AI coaching tips to help your team improve with every call.',
    },
    {
      icon: '👥',
      title: 'Team Management',
      desc: 'Manage your entire sales team, track performance, and compare results in one place.',
    },
    {
      icon: '📈',
      title: 'Performance Charts',
      desc: 'Beautiful visual charts showing scores, sentiment trends, and team progress over time.',
    },
    {
      icon: '📄',
      title: 'PDF Reports',
      desc: 'Export detailed analysis reports as PDF to share with your team or management.',
    },
  ]

  const steps = [
    {
      number: '01',
      icon: '📤',
      title: 'Upload Your Call',
      desc: 'Simply upload any sales call recording in MP3, WAV, or M4A format.',
    },
    {
      number: '02',
      icon: '🤖',
      title: 'AI Analyzes It',
      desc: 'Our AI transcribes the call and analyzes sentiment, objections, and performance.',
    },
    {
      number: '03',
      icon: '📊',
      title: 'Get Insights',
      desc: 'View detailed analysis with scores, charts, and personalized coaching tips.',
    },
    {
      number: '04',
      icon: '🚀',
      title: 'Improve & Grow',
      desc: 'Use AI coaching to continuously improve your sales team performance.',
    },
  ]

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      color: '#4361ee',
      bg: '#f0f4ff',
      features: ['5 calls per month', 'AI transcription', 'Basic analysis', '1 team member', 'PDF export'],
      button: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '₹999',
      period: 'per month',
      color: '#7209b7',
      bg: '#fdf4ff',
      features: [
        'Unlimited calls',
        'Advanced AI analysis',
        'Full team dashboard',
        'Up to 20 members',
        'Priority support',
        'Custom reports',
      ],
      button: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      color: '#1a1a2e',
      bg: '#f8faff',
      features: [
        'Unlimited everything',
        'Custom AI training',
        'Dedicated support',
        'Unlimited members',
        'API access',
        'Custom integration',
      ],
      button: 'Contact Sales',
      popular: false,
    },
  ]

  const faqs = [
    { q: 'What audio formats are supported?', a: 'We support MP3, WAV, M4A, FLAC and OGG formats up to 100MB per file.' },
    { q: 'How accurate is the AI transcription?', a: 'Our Whisper AI provides 95%+ accuracy for clear audio in English and many other languages.' },
    { q: 'Is my call data private?', a: 'Yes! Each organization has isolated data. No other organization can see your calls.' },
    { q: 'Can I try it for free?', a: 'Yes! Our free plan includes 5 calls per month with full AI analysis features.' },
    { q: 'How do team members join?', a: 'After creating an organization, you get a unique code. Share it with your team to join instantly.' },
  ]

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {/* ── NAVBAR ──────────────────────────── */}
      <nav
        style={{
          backgroundColor: 'white',
          padding: '0 40px',
          height: '70px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📈</span>
          <span
            style={{
              fontWeight: '800',
              fontSize: '22px',
              background: 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sales.AI
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{
                color: '#666',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '500',
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              color: '#4361ee',
              padding: '10px 20px',
              border: '2px solid #4361ee',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register/organization')}
            style={{
              backgroundColor: '#4361ee',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ────────────────────── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #1a1a2e 0%, #7c3aed 45%, #ec4899 75%, #06b6d4 100%)',
          padding: '100px 40px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '6px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            marginBottom: '24px',
            color: 'white',
          }}
        >
          🚀 AI Powered Sales Coaching
        </div>

        <h1
          style={{
            fontSize: '56px',
            fontWeight: '900',
            lineHeight: '1.2',
            marginBottom: '24px',
            maxWidth: '800px',
            margin: '0 auto 24px auto',
          }}
        >
          Turn Every Sales Call Into A
          <span
            style={{
              background: 'linear-gradient(90deg, #ffd60a, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {' '}
            Coaching Opportunity!
          </span>
        </h1>

        <p
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
          }}
        >
          Upload your sales calls and get instant AI analysis, sentiment tracking, objection detection, and personalized
          coaching tips.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/register/organization')}
            style={{
              backgroundColor: '#ffd60a',
              color: '#1a1a2e',
              padding: '16px 36px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            🚀 Start For Free
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '16px 36px',
              border: '2px solid white',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Sign In →
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginTop: '60px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { number: '95%', label: 'Transcription Accuracy' },
            { number: '10x', label: 'Faster Analysis' },
            { number: '100%', label: 'Private & Secure' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '40px', fontWeight: '900', color: '#ffd60a' }}>{stat.number}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ────────────────── */}
      <section id="features" style={{ padding: '80px 40px', backgroundColor: '#f8faff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e' }}>✨ Everything You Need</h2>
            <p style={{ color: '#666', fontSize: '18px', marginTop: '12px' }}>Powerful AI tools to supercharge your sales team</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 16px 50px rgba(124, 58, 237, 0.18)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'
                }}
              >
                <span style={{ fontSize: '40px' }}>{feature.icon}</span>
                <h3 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '700', marginTop: '16px', marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px 40px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e' }}>📊 How It Works</h2>
            <p style={{ color: '#666', fontSize: '18px', marginTop: '12px' }}>Get started in minutes</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '24px' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    backgroundColor: '#f0f4ff',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#4361ee',
                  }}
                >
                  {step.number}
                </div>

                <span style={{ fontSize: '36px' }}>{step.icon}</span>

                <h3 style={{ color: '#1a1a2e', fontSize: '16px', fontWeight: '700', marginTop: '12px', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ─────────────────── */}
      <section id="pricing" style={{ padding: '80px 40px', backgroundColor: '#f8faff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e' }}>💰 Simple Pricing</h2>
            <p style={{ color: '#666', fontSize: '18px', marginTop: '12px' }}>Start free, upgrade when you need more</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: plan.popular ? '0 8px 30px rgba(114,9,183,0.2)' : '0 2px 10px rgba(0,0,0,0.06)',
                  border: plan.popular ? '2px solid #7209b7' : '2px solid transparent',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  const root = e.currentTarget
                  root.style.transform = 'translateY(-6px)'
                  root.style.boxShadow = '0 18px 60px rgba(124, 58, 237, 0.18)'
                }}
                onMouseLeave={(e) => {
                  const root = e.currentTarget
                  root.style.transform = 'translateY(0px)'
                  root.style.boxShadow = plan.popular ? '0 8px 30px rgba(114,9,183,0.2)' : '0 2px 10px rgba(0,0,0,0.06)'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(124,58,237,0.18), rgba(236,72,153,0.18), rgba(6,182,212,0.18))',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.35s ease',
                    zIndex: 0,
                  }}
                  className="lp-pricing-sweep"
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#7209b7',
                        color: 'white',
                        padding: '4px 20px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <h3 style={{ color: plan.color, fontSize: '20px', fontWeight: '700' }}>{plan.name}</h3>

                  <div style={{ margin: '16px 0' }}>
                    <span style={{ fontSize: '40px', fontWeight: '900', color: '#1a1a2e' }}>{plan.price}</span>
                    <span style={{ color: '#666', fontSize: '14px', marginLeft: '8px' }}>{plan.period}</span>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    {plan.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ color: plan.color }}>✓</span>
                        <span style={{ color: '#334155', fontSize: '14px' }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/register/organization')}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: plan.popular ? '#7209b7' : plan.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ─────────────────────── */}
      <section id="faq" style={{ padding: '80px 40px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a2e' }}>❓ FAQ</h2>
            <p style={{ color: '#666', fontSize: '18px', marginTop: '12px' }}>Common questions answered</p>
          </div>

          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  backgroundColor: activeFaq === i ? '#f0f4ff' : 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                }}
              >
                {faq.q}
                <span style={{ fontSize: '20px' }}>{activeFaq === i ? '−' : '+'}</span>
              </button>

              {activeFaq === i && (
                <div
                  style={{
                    padding: '16px 24px',
                    backgroundColor: '#f8faff',
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #7c3aed 40%, #06b6d4 100%)',
          padding: '80px 40px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '16px' }}>Ready To Transform Your Sales Team?</h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>Join organizations already using Sales.AI</p>
        <button
          onClick={() => navigate('/register/organization')}
          style={{
            backgroundColor: '#ffd60a',
            color: '#1a1a2e',
            padding: '18px 48px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '20px',
            fontWeight: '900',
            cursor: 'pointer',
          }}
        >
          🚀 Get Started Free Today!
        </button>
      </section>

      {/* ── FOOTER ──────────────────────────── */}
      <footer
        style={{
          backgroundColor: '#1a1a2e',
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>📈</span>
          <span
            style={{
              fontWeight: '800',
              fontSize: '20px',
              background: 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sales.AI
          </span>
        </div>
        <p>© 2025 Sales.AI — AI Powered Sales Intelligence</p>
        <p style={{ marginTop: '8px' }}>Built with ❤️ for sales teams worldwide</p>
      </footer>
    </div>
  )
}

export default LandingPage
