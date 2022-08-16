import * as NOTIFICATION_TASKS from '../actions/notification_tasks'
import store from '@/store/index.js'

const state = {
  notificationtasks: [],
  status: ''
}

const actions = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_GENERATE]: ({ commit }) => {
    const userUid = store.state.user.user.current_user_uid
    const userDep = store.state.employees.employees[userUid].uid_dep
    const uncompletedReglaments = Object.values(store.state.reglaments.reglaments)
      .filter((reglament) => { return (reglament.department_uid === userDep || reglament.department_uid === '') && !reglament.is_passed })
      .map((reglament) => { return { uid: reglament.uid, name: reglament.name, notify: true } })
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_SET, uncompletedReglaments)
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, 'success')
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: ({ commit }) => {
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_SET, [])
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, '')
  }
}

const mutations = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_SET]: (state, resp) => {
    state.notificationtasks = resp
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET]: (state, resp) => {
    state.status = resp
  }
}

export default {
  state,
  actions,
  mutations
}
