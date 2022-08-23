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
    console.log(tab.code)
    if (store.state.isPropertiesMobileExpanded) {
      store.dispatch('asidePropertiesToggle', false)
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
