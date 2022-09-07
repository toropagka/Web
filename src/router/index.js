import BoardWithChildren from '@/components/Board/BoardWithChildren.vue'
import Colors from '@/components/Colors.vue'
import Doitnow from '@/components/Doitnow.vue'
import Employees from '@/components/Employees.vue'
import Projects from '@/components/Projects.vue'
import Tags from '@/components/Tags/Tags.vue'
import store from '@/store'
import CardFile from '@/views/CardFile'
import Home from '@/views/Home'
import TaskFile from '@/views/TaskFile'

import ProjectWithChildren from '@/components/Projects/ProjectWithChildren.vue'
import ReglamentContent from '@/components/Reglaments/ReglamentContent.vue'
import Reglaments from '@/components/Reglaments/Reglaments.vue'
import TasksOverdue from '@/components/TasksList/TasksOverdue.vue'
import TasksReady from '@/components/TasksList/TasksReady.vue'
import TasksToday from '@/components/TasksList/TasksToday.vue'
import TasksUnread from '@/components/TasksList/TasksUnread.vue'

import AccKarma from '@/components/Settings/AccKarma.vue'
import Account from '@/components/Settings/Account.vue'
import Options from '@/components/Settings/Options.vue'
import Support from '@/components/Settings/Support.vue'
import Tarif from '@/components/Settings/Tarif.vue'

import Boards from '@/components/Boards'
import Search from '@/components/Search'
import TaskByUid from '@/components/TasksList/TaskByUid.vue'
import TasksByDate from '@/components/TasksList/TasksByDate.vue'
import TasksDelegateByMe from '@/components/TasksList/TasksDelegateByMe.vue'
import TasksDelegateToMe from '@/components/TasksList/TasksDelegateToMe.vue'
import TasksInFocus from '@/components/TasksList/TasksInFocus'
import TasksInWork from '@/components/TasksList/TasksInWork'
import TaskUnsorted from '@/components/TasksList/TaskUnsorted.vue'
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
    if (
      window.location.pathname.includes('task') &&
      !window.location.pathname.includes('tasks')
    ) {
      next()
    }
    next('/doitnow')
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
      layout: Home
    },
    path: '/task/:id',
    name: 'task',
    component: TaskByUid,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/:date',
    name: 'tasksByDate',
    component: TasksByDate,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/today',
    name: 'tasksToday',
    component: TasksToday,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/unread',
    name: 'tasksUnread',
    component: TasksUnread,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/delegate-to-me/:employee_uid',
    name: 'tasksDelegateToMe',
    component: TasksDelegateToMe,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/delegate-by-me/:employee_uid',
    name: 'tasksDelegateByMe',
    component: TasksDelegateByMe,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/account/myaccount',
    name: 'myaccount',
    component: Account,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/help',
    name: 'help',
    component: Support,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/account/karma',
    name: 'karma',
    component: AccKarma,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/tarif',
    name: 'tarif',
    component: Tarif,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/options',
    name: 'options',
    component: Options,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/in-work',
    name: 'tasksInWork',
    component: TasksInWork,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/in-focus',
    name: 'tasksInFocus',
    component: TasksInFocus,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/ready',
    name: 'tasksReady',
    component: TasksReady,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/unsorted',
    name: 'taskUnsorted',
    component: TaskUnsorted,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/tasks/overdue',
    name: 'tasksOverdue',
    component: TasksOverdue,
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
      title: 'Card file'
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
    path: '/board',
    name: 'board',
    component: Boards,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/board/:board_id',
    name: 'boardWithChildren',
    component: BoardWithChildren,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/doitnow',
    name: 'doitnow',
    component: Doitnow,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/tags',
    name: 'tags',
    component: Tags,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/employees',
    name: 'employees',
    component: Employees,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home,
      breadcrumb: {
        name: 'Поиск: '
      }
    },
    path: '/search',
    name: 'search',
    component: Search,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home
    },
    path: '/settings/colors',
    name: 'colors',
    component: Colors,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home,
      breadcrumb: {
        name: 'Проекты',
        to: '/project'
      }
    },
    path: '/project',
    name: 'allProjects',
    component: Projects,
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
