import * as TAB from '../actions/tabs'
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
    if (store.state.isPropertiesMobileExpanded) {
      store.dispatch('asidePropertiesToggle', false)
    }

    switch (tab.code) {
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
    store.state.navigator.lastTab = tab.code
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
