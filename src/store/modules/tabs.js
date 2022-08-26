import store from '@/store/index.js'
import * as TAB from '../actions/tabs'

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
    switch (tab?.code) {
      case 'doitnow':
        localStorage.setItem('lastTab', 'doitnow')
        break
      default:
        break
    }
    store.state.navigator.lastTab = tab.code
    store.state.navigator.menu = []
    store.state.navigator.menu.code = tab.code
    if (tab.items) {
      store.state.navigator.menu.push(...tab.items)
    }
  }
}

export default {
  getters,
  actions
}
