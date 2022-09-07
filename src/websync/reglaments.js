import store from '@/store/index.js'
import * as NAVIGATOR from '@/store/actions/navigator.js'
import * as REGLAMENTS from '@/store/actions/reglaments.js'

export function createReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_PUSH_REGLAMENT, obj.obj)
  store.commit(REGLAMENTS.ADD_REGLAMENT, obj.obj)
}

export function deleteReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_REMOVE_REGLAMENT, obj.obj)
  // store.commit(REGLAMENTS.DELETE_REGLAMENT_REQUEST, obj.obj)
}

export function updateReglament (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_UPDATE_REGLAMENT, obj.obj)
  store.commit(REGLAMENTS.REGLAMENT_CHANGE_REGLAMENTS, obj.obj)
}
