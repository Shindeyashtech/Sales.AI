// authStore.js
// Global login state
// All pages can read this!

import { create } from 'zustand'

const useAuthStore = create((set) => ({

  // Initial state
  user:     null,
  token:    null,
  isLoggedIn: false,

  // Login action
  // Saves user data and token
  login: (userData, token) => {
    // Save to localStorage so
    // data persists after refresh
    localStorage.setItem('token',    token)
    localStorage.setItem('user',     JSON.stringify(userData))

    set({
      user:       userData,
      token:      token,
      isLoggedIn: true
    })
  },

  // Logout action
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('calls')

    set({
      user:       null,
      token:      null,
      isLoggedIn: false
    })
  },

  // Load from localStorage
  // Called when app starts
  loadFromStorage: () => {
    const token = localStorage.getItem('token')
    const user  = localStorage.getItem('user')

    if (token && user) {
      set({
        token:      token,
        user:       JSON.parse(user),
        isLoggedIn: true
      })
    }
  }

}))

export default useAuthStore