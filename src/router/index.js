import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import urlProvider from "@/providers/UrlProvider.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/song/:id?',
      name: 'song',
      component: () => import('../components/SongEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/playlist-edit/:id?',
      name: 'playlist',
      component: () => import('../components/PlaylistEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: "/playlist/:id",
      name: "playlist-view",
      component: () => import("@/views/PlaylistView.vue"),
    },
    {
      path: '/alfred',
      name: 'alfred',
      component: () => import('../views/AlfredView.vue'),
      meta: { requiresAuth: true }
    }

  ],
})



async function isAuthenticated() { // TODO: pre alpha release
  try {
    const res = await fetch(urlProvider.getBaseUrl() + '/Authentication/test', { method: 'GET', credentials: 'include', })
    return res.status === 200
  } catch (e) {
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  const _isAuthenticated = await isAuthenticated()
  if (to.meta.requiresAuth && !_isAuthenticated) next({ name: 'login' })
  else if (to.path === '/' && _isAuthenticated) next()
  // else if (to.meta.forLocalAdminOnly && !store.info.isAdmin) next({ name: 'courses' })
  else next()
})

export default router
