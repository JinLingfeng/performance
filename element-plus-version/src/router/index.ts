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
                    path: '/assessment/cycle/:id',
                    name: 'assessment-cycle-detail',
                    component: () => import('@/views/assessment/CycleDashboard.vue'),
                },
                {
                    path: '/assessment/hall',
                    name: 'assessment-hall',
                    component: () => import('@/views/assessment/PerformanceHall.vue'),
                },
                {
                    path: '/daily-report',
                    name: 'daily-report-list',
                    component: () => import('@/views/report/DailyReportList.vue'),
                },
                {
                    path: '/daily-report/fill',
                    name: 'daily-report-fill',
                    component: () => import('@/views/report/DailyReportForm.vue'),
                },
                {
                    path: '/daily-report/h5',
                    name: 'daily-report-h5',
                    component: () => import('@/views/report/DailyReportMobile.vue'),
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
