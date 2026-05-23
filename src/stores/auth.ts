import { defineStore } from 'pinia'
const apiBase = import.meta.env.VITE_API_BASE_URL

interface User {
  id: string
  name: string
  avatarUrl: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      this.loading = true

      try {
        const response = await fetch(apiBase + '/api/me', {
          credentials: 'include',
        })

        if (!response.ok) {
          this.user = null
          return
        }

        this.user = await response.json()
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await fetch(apiBase + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      this.user = null
    },
  },
})
