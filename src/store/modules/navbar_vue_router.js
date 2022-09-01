/**
 * Стор для навбара, написанного для vue-router
 */

const state = {
  breadcrumbs: []
}

const getters = {}

const actions = {}

const mutations = {
  set (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  },
  push (state, breadcrumb) {
    state.breadcrumbs.push(breadcrumb)
  },
  pop (state) {
    state.breadcrumbs.pop()
  },
  replace (state, payload) {
    const index = state.breadcrumbs.findIndex((breadcrumb) => {
      return breadcrumb.text === payload.find
    })

    if (index) {
      state.breadcrumbs.splice(index, 1, payload.replace)
    }
  },
  empty (state) {
    state.breadcrumbs = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
