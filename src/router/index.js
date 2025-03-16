import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Auth from '../views/Auth.vue'
import Challenges from '../views/Challenges.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import Teams from '../views/Teams.vue'

const routes = [
    { path: '/auth', name: 'Auth', component: Auth },
    { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/challenges', name: 'Challenges', component: Challenges, meta: { requiresAuth: true } },
    { path: '/teams', name: 'Teams', component: Teams, meta: { requiresAuth: true } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.user) {
        next({ name: 'Auth' })
    } else {
        next()
    }
})

export default router
