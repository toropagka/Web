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
  showModals: localStorage.getItem('visitedModals'),
  hintUid: {
    '2cf6b167-6506-4b05-bc34-70a8d88e3b25': 'doitnow',
    '901841d9-0016-491d-ad66-8ee42d2b496b': 'tasks',
    '169d728b-b88b-462d-bd8e-3ac76806605b': 'assignment',
    '7af232ff-0e29-4c27-a33b-866b5fd6eade': 'project',
    '92413f6c-2ef3-476e-9429-e76d7818685d': 'reglaments',
    '1b30b42c-b77e-40a4-9b43-a19991809add': 'boards',
    'd28e3872-9a23-4158-aea0-246e2874da73': 'employee'
  }
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
      name: 'Очередь',
      value: { uid: '2cf6b167-6506-4b05-bc34-70a8d88e3b25', param: new Date() },
      typeVal: new Date(),
      type: 'date'
    }
    commit('updateStackWithInitValue', navElem)
    commit('basic', { key: 'mainSectionState', value: 'greed' })
    commit('basic', { key: 'greedPath', value: 'doitnow' })
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
