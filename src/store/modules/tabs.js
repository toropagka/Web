import * as TAB from '../actions/tabs'
import { UID_TO_ACTION } from '../helpers/functions'
import store from '@/store/index.js'

const getters = {
  lastTab () {
    return store.state.navigator.lastTab
  },
  storeNavigator () {
    return store.state.navigator.navigator
  }
}

const actions = {
  [TAB.SWITCH_TAB]: ({ commit, getters }, tab) => {
    if (tab.code === getters.lastTab) {
      return
    }
    console.log(tab.code)
    localStorage.setItem('lastTab', tab.code)
    if (store.state.isPropertiesMobileExpanded) {
      store.dispatch('asidePropertiesToggle', false)
    }
    switch (tab.code) {
      case 'doitnow':
        break
      case 'tasks':
        store.dispatch(UID_TO_ACTION['901841d9-0016-491d-ad66-8ee42d2b496b'])
        // asidemenu logic
        store.commit('updateStackWithInitValue', {
          name: 'Сегодня',
          key: 'taskListSource',
          value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() },
          typeVal: new Date(),
          type: 'date'
        })
        store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
        store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        break
      case 'directory':
        // asidemenu logic
        store.commit('updateStackWithInitValue', {
          name: 'Регламенты',
          key: 'greedSource',
          greedPath: 'reglaments',
          value: getters.storeNavigator.reglaments?.items
        })
        store.commit('basic', { key: 'greedSource', value: getters.storeNavigator.reglaments?.items })
        store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        store.commit('basic', { key: 'greedPath', value: 'reglaments' })
        break
      case 'clients':
        break
      case 'settings':
        store.commit('updateStackWithInitValue', {
          name: 'Аккаунт',
          value: { uid: '9d3ba501-c173-462d-9b5f-0db97c06a026', param: new Date() },
          typeVal: new Date(),
          type: 'account'
        })
        store.commit('basic', { key: 'mainSectionState', value: 'settings' })
        store.state.navigator.currentSettingsTab = 'account'
        break
      default:
        break
    }
    store.state.navigator.lastTab = localStorage.getItem('lastTab')
    store.state.navigator.menu = []
    store.state.navigator.menu.code = tab.code
    if (tab.items) {
      store.state.navigator.menu.push(...tab.items)
      console.log(store.state.navigator.menu, tab.items)
      console.log(store.state.navigator.menu)
    }
  }
}

export default {
  getters,
  actions
}
