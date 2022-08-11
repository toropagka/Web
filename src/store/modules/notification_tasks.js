import * as NOTIFICATION_TASKS from '../actions/notification_tasks'
import store from '@/store/index.js'

const state = {
  notificationsTasks: false,
  reglaments: null
}

const getters = {
  uncompletedReglaments: (state) => state.notificationsTasks
}

const actions = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_REQUEST]: ({ commit, dispatch }) => {
    const uncompletedReglaments = Object.values(store.state.reglaments.reglaments).filter((reglament) => { return reglament.department_uid && !reglament.is_passed })
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASK_SET, uncompletedReglaments)
  }
}

const mutations = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: (state) => {
    state.notificationsTasks = []
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASK_SET]: (state, resp) => {
    state.notificationsTasks = resp
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
