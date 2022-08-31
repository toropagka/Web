import store from '@/store'
import CardFile from '@/views/CardFile'
import Home from '@/views/Home'
import Doitnow from '@/components/Doitnow.vue'
import Empty from '@/components/Empty.vue'
import Settings from '@/components/Settings/Settings.vue'
import TaskFile from '@/views/TaskFile'
import Colors from '@/components/Colors.vue'
import Employees from '@/components/Employees.vue'
import Tags from '@/components/Tags/Tags.vue'
import BoardWithChildren from '@/components/Board/BoardWithChildren.vue'

import Reglaments from '@/components/Reglaments/Reglaments.vue'
import ReglamentContent from '@/components/Reglaments/ReglamentContent.vue'
import ProjectWithChildren from '@/components/Projects/ProjectWithChildren.vue'
import TasksToday from '@/components/TasksList/TasksToday.vue'
import TasksReady from '@/components/TasksList/TasksReady.vue'
import TasksUnread from '@/components/TasksList/TasksUnread.vue'

import { createRouter, createWebHistory } from 'vue-router'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const shouldRedirectToLogin = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (window.location.pathname.includes('task') && !window.location.pathname.includes('tasks')) {
      next()
      return
    }
    const lastTab = localStorage.getItem('lastTab')
    if (lastTab === null) {
      next('/doitnow')
      return
    }
    next(`/${lastTab}`)
  } else {
    next('/login')
  }
}

const ifRouteNotExists = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/doitnow')
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
    path: '/tasks/today',
    name: 'tasksToday',
    component: TasksToday,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      // title: 'Application'
    },
    path: '/tasks/unread',
    name: 'tasksUnread',
    component: TasksUnread,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/tasks/ready',
    name: 'tasksReady',
    components: TasksReady,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/reglaments',
    name: 'reglaments',
    component: Reglaments,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/reglaments/:id',
    component: ReglamentContent,
    name: 'currentReglament',
    beforeEnter: shouldRedirectToLogin
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
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/board/:board_id',
    name: 'board',
    component: BoardWithChildren,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/doitnow',
    name: 'doitnow',
    component: Doitnow,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/tasks',
    name: 'tasks',
    component: Home,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/directory',
    name: 'directory',
    component: Home,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/clients',
    name: 'clients',
    component: Empty,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {},
    path: '/settings',
    name: 'settings',
    component: Settings,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tags',
    name: 'tags',
    component: Tags,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/employees',
    name: 'employees',
    component: Employees,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/colors',
    name: 'colors',
    component: Colors,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/project/:project_id',
    name: 'project',
    component: ProjectWithChildren,
    beforeEnter: shouldRedirectToLogin
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
