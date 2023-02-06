import { createRouter, createWebHistory } from 'vue-router'
import GraficoView from '../views/GraficoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'grafico',
      component: GraficoView,
    },
    {
      path: '/reportes',
      name: 'reportes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ReportesView.vue'),
    },
    {
      path: '/reporte',
      name: 'reporte',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ReportDetalladoView.vue'),
    },
  ],
})

export default router
