import store from '@/store'
import CardFile from '@/views/CardFile'
import Home from '@/views/Home'
import Settings from '@/components/Settings.vue'
import Doitnow from '@/components/Doitnow.vue'
import Empty from '@/components/Empty.vue'
import Reglament from '@/components/Reglaments/Reglaments.vue'
import TaskFile from '@/views/TaskFile'
import { createRouter, createWebHistory } from 'vue-router'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/tasks')
  } else {
    next('/login')
  }
}

const ifRouteNotExists = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/')
  } else {
    next('/login')
  }
}

const routes = [
  {
    meta: {
      // title: 'Application'
    },
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      // title: 'Application'
    },
    path: '/task/:id',
    name: 'task',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      // title: 'Application'
    },
    path: '/project/:id',
    name: 'project',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      // title: 'Application'
    },
    path: '/reglament/:id',
    name: 'reglament',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      // title: 'Application'
    },
    path: '/board/:id',
    name: 'board',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Task file'
    },
    path: '/taskfile/:id',
    name: 'taskfile',
    component: TaskFile,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Task file'
    },
    path: '/cardfile/:id',
    name: 'cardfile',
    component: CardFile,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {},
    path: '/doitnow',
    name: 'doitnow',
    component: Doitnow
  },
  {
    meta: {},
    path: '/tasks',
    name: 'tasks',
    component: Home
  },
  {
    meta: {},
    path: '/directory',
    name: 'directory',
    component: Reglament
  },
  {
    meta: {},
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    meta: {},
    path: '/clients',
    name: 'clients',
    component: Empty
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/:pathMatch(.*)*',
    beforeEnter: ifRouteNotExists
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
