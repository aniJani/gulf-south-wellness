import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
    {
        path: '/auth',
        component: () => import('../components/layout/AuthLayout.vue'),
        children: [
            {
                path: '',
                name: 'Auth',
                component: () => import('../views/Auth.vue')
            }
        ]
    },
    {
        path: '/',
        component: () => import('../components/layout/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: 'challenges',
                name: 'Challenges',
                component: () => import('../views/Challenges.vue')
            },
            {
                path: 'teams',
                name: 'Teams',
                component: () => import('../views/Teams.vue')
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('../views/Profile.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Auth' })
    } else {
        next()
    }
})

export default router
