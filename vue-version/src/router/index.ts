import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/default.vue'
import HomeView from '@/views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView,
                },
                {
                    path: '/configuration',
                    name: 'performance-configuration',
                    component: () => import('@/views/PerformanceConfig.vue'),
                },
                {
                    path: '/library',
                    redirect: '/configuration',
                },
                {
                    path: '/template',
                    redirect: '/configuration',
                },
                {
                    path: '/template/builder',
                    name: 'template-builder',
                    component: () => import('@/views/template/Builder.vue'),
                },
                {
                    path: '/assessment/cycle',
                    name: 'assessment-cycle',
                    component: () => import('@/views/assessment/Cycle.vue'),
                },
                {
                    path: '/assessment/hall',
                    name: 'assessment-hall',
                    component: () => import('@/views/assessment/PerformanceHall.vue'),
                },
                {
                    path: '/assessment/team',
                    redirect: '/assessment/hall',
                },
                {
                    path: '/assessment/rating',
                    redirect: '/assessment/hall',
                },
                {
                    path: '/assessment/my',
                    redirect: '/assessment/hall',
                },
                {
                    path: '/assessment/cycle/:id/stats',
                    name: 'assessment-cycle-stats',
                    component: () => import('@/views/assessment/CycleDashboard.vue'),
                },
            ],
        },
    ],
})

export default router
