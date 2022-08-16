import * as NOTIFICATION_TASKS from '../actions/notification_tasks'
import store from '@/store/index.js'

const state = {
  notificationTasks: []
}

const actions = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_GENERATE]: ({ commit }) => {
    const userUid = store.state.user.user.current_user_uid
    const userDep = store.state.employees.employees[userUid].uid_dep
    const uncompletedReglaments = Object.values(store.state.reglaments.reglaments)
      .filter((reglament) => { return reglament.department_uid === userDep && !reglament.is_passed })
      .map((reglament) => { return { uid: reglament.uid, name: reglament.name, notify: true } })
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASK_SET, uncompletedReglaments)
  }
}

const mutations = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: (state) => {
    state.notificationTasks = []
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASK_SET]: (state, resp) => {
    state.notificationTasks = resp
  }
}

export default {
  state,
  actions,
  mutations
}
