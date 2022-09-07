import store from '@/store/index.js'
import router from '@/router'
import * as NAVIGATOR from '@/store/actions/navigator'

export function createProject (obj) {
  store.commit(NAVIGATOR.NAVIGATOR_PUSH_COMMON_PROJECT, [obj.obj])
}

export function removeProject (obj) {
  if (router.currentRoute.value.fullPath === `/project/${obj.uid}`) {
    router.push('/doitnow')
  }
  store.commit(NAVIGATOR.NAVIGATOR_REMOVE_PROJECT, { uid_parent: '', uid: obj.uid })
}

export function updateProject (obj) {
  store.commit('NAVIGATOR_UPDATE_PROJECT', obj.obj)
}
