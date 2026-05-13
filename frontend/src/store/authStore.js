import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user:        null,
  token:       null,
  isLoggedIn:  false,
  isLoading:   true,  // ← NEW!

  login: (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    set({
      user:       userData,
      token:      token,
      isLoggedIn: true,
      isLoading:  false
    })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('calls')
    set({
      user:       null,
      token:      null,
      isLoggedIn: false,
      isLoading:  false
    })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token')
    const user  = localStorage.getItem('user')

    if (token && user) {
      set({
        token:      token,
        user:       JSON.parse(user),
        isLoggedIn: true,
        isLoading:  false
      })
    } else {
      set({ isLoading: false })
    }
  }
}))

export default useAuthStore