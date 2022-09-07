import store from '@/store/index.js'

const getters = {
  storeNavigator () {
    return store.state.navigator.navigator
  }
}

export default {
  getters
}
