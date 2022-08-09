import axios from 'axios'
import {
  USER_CHANGE_PHONE,
  USER_CHANGE_PHOTO,
  USER_ERROR,
  USER_JUST_REGISTERED_TOGGLE,
  USER_REQUEST,
  USER_START_ONBOARDING,
  USER_SUCCESS,
  USER_VIEWED_MODAL
} from '../actions/user'
import { setLocalStorageItem } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'

const state = {
  user: null,
  status: '',
  justRegistered: localStorage.getItem('justRegistered'),
  hasLoadedOnce: false,
  visitedModals: localStorage.getItem('visitedModals') ? JSON.parse(localStorage.getItem('visitedModals')) : null,
  hideNavBar: false,
  newUserTasks: false,
  showOnboarding: false,
  showModals: localStorage.getItem('visitedModals')
}

const getters = {}

const actions = {
  [USER_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(USER_ERROR, err)
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHOTO]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/foto'
      axios({
        data: data.file,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          dispatch(USER_REQUEST).then((resp) => {
            commit(USER_CHANGE_PHOTO)
            resolve(resp)
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [USER_CHANGE_PHONE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/phone'
      axios({
        data: data,
        url: url,
        method: 'PATCH'
      })
        .then((resp) => {
          commit(USER_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [USER_START_ONBOARDING]: ({ commit, dispatch }, data) => {
    commit(USER_START_ONBOARDING)
    commit(USER_JUST_REGISTERED_TOGGLE, true)

    dispatch(TASK.TASKS_REQUEST)
    const navElem = {
      name: 'Сегодня',
      key: 'taskListSource',
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() },
      typeVal: new Date(),
      type: 'date'
    }
    commit('updateStackWithInitValue', navElem)
    commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
    commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}

const mutations = {
  [USER_CHANGE_PHOTO]: (state, data) => {
    state.user.foto_link = state.user.foto_link + '&Z=' + Date.now()
  },
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.user = resp.data
    console.log('current user', state.user)
    state.hasLoadedOnce = true
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  ChangeCurrentUserName: (state, name) => {
    if (state.user) {
      state.user.current_user_name = name
    }
  },
  [USER_START_ONBOARDING]: (state) => {
    setLocalStorageItem('visitedModals', JSON.stringify([]))
    state.visitedModals = []
    state.showModals = true
    state.hideNavBar = true

    state.user.justRegistered = true
    state.user.showModals = true
    state.user.showOnboarding = true
  },
  [USER_VIEWED_MODAL]: (state, data) => {
    const newData = state.visitedModals ? [...state.visitedModals, data] : [data]
    setLocalStorageItem('visitedModals', JSON.stringify(newData))
    state.visitedModals = newData
    state.hideNavBar = false
  },
  [USER_JUST_REGISTERED_TOGGLE]: (state, data) => {
    state.justRegistered = data
    setLocalStorageItem('justRegistered', data)
    if (data === false) {
      localStorage.removeItem('justRegistered')
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
