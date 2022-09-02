/* eslint-disable indent */
import store from '@/store/index.js'
import { shouldAddTaskIntoList } from './utils'
import { NAVIGATOR_UPDATE_ASSIGNMENTS } from '@/store/actions/navigator'
import { TASK_STATUS } from '@/constants'

export function createTask (obj) {
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  }
}

export function removeTask (uid) {
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.dispatch('UPDATE_TASK', obj) // updates task and extracts another tags & colors
  if ([TASK_STATUS.TASK_READY, TASK_STATUS.TASK_COMPLETED].includes(obj.obj.status)) {
    return
  }
  // Если задача поручена мне - запросить обновленные поручения от сервера,
  // чтобы отобразить на вкладке 'Поручения'
  if (obj.obj.email_performer === store.state.user.user.current_user_email) {
    store.dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
      .then(() => {
        // Если прямо сейчас находимся на вкладке поручений обновить greedSource
        if (store.state.greedPath === 'new_delegate') {
          store.commit('basic', { key: 'greedSource', value: store.getters.sortedNavigator.new_delegate })
        }
      })
  }
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  } else { // Если меняется дата
    store.commit('REMOVE_TASK', obj.obj.uid)
  }
}
