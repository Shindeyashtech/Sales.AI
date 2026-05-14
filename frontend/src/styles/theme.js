// theme.js
// Our design system colors and styles

export const colors = {
  primary:   '#7c3aed',
  secondary: '#ec4899',
  success:   '#10b981',
  warning:   '#f59e0b',
  danger:    '#ef4444',
  dark:      '#1a1a2e',
  gray:      '#64748b',
  light:     '#f8f7ff',
}

export const gradients = {
  primary:   'linear-gradient(135deg, #7c3aed, #ec4899)',
  secondary: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
  success:   'linear-gradient(135deg, #10b981, #3b82f6)',
  bg:        'linear-gradient(135deg, #f8f7ff 0%, #fdf4ff 50%, #f0f9ff 100%)',
  dark:      'linear-gradient(135deg, #1a1a2e, #4c1d95)',
}

export const shadows = {
  card:   '0 4px 24px rgba(124, 58, 237, 0.10)',
  hover:  '0 8px 32px rgba(124, 58, 237, 0.20)',
  button: '0 4px 14px rgba(124, 58, 237, 0.30)',
}

export const card = {
  backgroundColor: 'white',
  borderRadius:    '20px',
  padding:         '24px',
  boxShadow:       '0 4px 24px rgba(124, 58, 237, 0.10)',
  border:          '1px solid rgba(124, 58, 237, 0.08)',
  transition:      'all 0.3s ease',
}

export const button = {
  primary: {
    background:   'linear-gradient(135deg, #7c3aed, #ec4899)',
    color:        'white',
    border:       'none',
    borderRadius: '12px',
    padding:      '12px 24px',
    fontWeight:   '600',
    fontSize:     '15px',
    cursor:       'pointer',
    fontFamily:   'Inter, sans-serif',
  },
  secondary: {
    background:   'white',
    color:        '#7c3aed',
    border:       '2px solid #7c3aed',
    borderRadius: '12px',
    padding:      '12px 24px',
    fontWeight:   '600',
    fontSize:     '15px',
    cursor:       'pointer',
    fontFamily:   'Inter, sans-serif',
  },
  danger: {
    background:   '#fff1f2',
    color:        '#e11d48',
    border:       '1px solid #fecdd3',
    borderRadius: '12px',
    padding:      '10px 20px',
    fontWeight:   '500',
    fontSize:     '14px',
    cursor:       'pointer',
    fontFamily:   'Inter, sans-serif',
  }
}