import store from '@/store/index.js'
import * as REGLAMENT from '@/store/actions/reglaments'
import router from '@/router'

const shouldDoAnything = (reglamentUid) => router.currentRoute.value.fullPath === `/reglaments/${reglamentUid}`

export function createReglamentQuestion (obj) {
  if (shouldDoAnything(obj.obj.uid_reglament)) {
    obj.obj.answers = [] // здесь добавляем, потому что в вопросе нужен изначально пустой массив ответов
    store.commit(REGLAMENT.REGLAMENT_PUSH_QUESTION, obj.obj)
  }
}

export function deleteReglamentQuestion (obj) {
  store.commit(REGLAMENT.REGLAMENT_DELETE_QUESTION, obj.obj) // second param is question uuid
}

export function updateReglamentQuestion (obj) {
  if (shouldDoAnything(obj.obj.uid_reglament)) {
    store.commit(REGLAMENT.REGLAMENT_UPDATE_QUESTION, obj.obj)
  }
}
