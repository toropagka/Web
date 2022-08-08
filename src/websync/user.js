import store from '@/store/index.js'

export function updateCurrentUser (obj) {
  store.commit('ChangeCurrentUserObj', obj.obj)
}
