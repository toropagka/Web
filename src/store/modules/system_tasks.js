import * as SYSTEM_TASKS from '../actions/system_tasks'

const state = {
  notifications: false
}

const actions = {
  [SYSTEM_TASKS.NOTIFICATION_TASKS_REQUEST]: (state) => {
    state.notifications = [{ name: 'System Task 1', uid: 1 }, { name: 'System Task 1', uid: 1 }, { name: 'System Task 1', uid: 1 }]
  }
}

export default {
  state,
  actions
}
