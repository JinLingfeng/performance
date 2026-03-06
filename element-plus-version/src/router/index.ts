import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: '',
                    redirect: '/configuration',
                },
                {
                    path: '/configuration',
                    name: 'performance-configuration',
                    component: () => import('@/views/PerformanceConfig.vue'),
                },
                {
                    path: '/assessment/cycle',
                    name: 'assessment-cycle',
                    component: () => import('@/views/assessment/Cycle.vue'),
                },
                {
                    path: '/assessment/cycle/:id/stats',
                    name: 'assessment-cycle-stats',
                    component: () => import('@/views/assessment/CycleDashboard.vue'),
                },
                {
                    path: '/assessment/hall',
                    name: 'assessment-hall',
                    component: () => import('@/views/assessment/PerformanceHall.vue'),
                },
                {
                    path: '/template/builder',
                    name: 'template-builder',
                    component: () => import('@/views/template/Builder.vue'),
                },
            ],
        },
    ],
})

export default router
