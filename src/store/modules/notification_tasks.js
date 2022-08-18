import * as NOTIFICATION_TASKS from '../actions/notification_tasks'
import store from '@/store/index.js'

const state = {
  notificationtasks: [],
  status: ''
}

const actions = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_GENERATE]: ({ commit, dispatch }) => {
    const userUid = store.state.user.user.current_user_uid
    const userDep = store.state.employees.employees[userUid].uid_dep
    const reglaments = Object.values(store.state.reglaments.reglaments).filter(reglament => {
      return (reglament.department_uid === userDep ||
        reglament.department_uid === '') &&
        !reglament.is_passed
    })
    return Promise.all(
      reglaments.map((reglament) => {
        return new Promise((resolve, reject) => {
          store.dispatch('REGLAMENT_REQUEST', reglament.uid)
            .then(() => {
              const reglamentQuestions = store.state.reglaments.reglamentQuestions
              resolve(reglamentQuestions.length)
            })
            .catch((err) => {
              reject(err)
            })
        }).then((result) => {
          if (result !== 0) {
            const notifyElem = {
              uid: reglament.uid,
              name: reglament.name,
              notify: true
            }
            commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_PUSH, notifyElem)
          }
        })
      })
    ).then(() => {
      commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, 'success')
    })
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: ({ commit }) => {
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR)
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, '')
  }
}

const mutations = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_PUSH]: (state, resp) => {
    state.notificationtasks.push(resp)
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET]: (state, resp) => {
    state.status = resp
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: (state) => {
    state.notificationtasks = []
  }
}

export default {
  state,
  actions,
  mutations
}
