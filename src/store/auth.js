import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        // token: null // if your API returns a token, otherwise you can remove this
    }),
    actions: {
        setUser(userData) {
            this.user = userData
            localStorage.setItem('user', JSON.stringify(userData))
        },
        logout() {
            this.user = null
            localStorage.removeItem('user')
        },
        initialize() {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                this.user = JSON.parse(storedUser)
            }
        }
    }
})
