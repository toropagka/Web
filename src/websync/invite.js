import store from '@/store/index.js'

export function createInvite (obj) {
  store.commit('initInviteMe', obj)
}
