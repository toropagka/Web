const state = {
  todayAttribute: {
    key: 'today',
    highlight: { fillMode: 'outline', class: 'today' },
    dates: new Date()
  },
  lastVisitedAttribute: {
    highlight: { color: 'orange', class: 'vc-highlight' },
    dates: new Date()
  },
  dotsAttribute: {
    order: 1,
    dates: [],
    highlight: { color: 'dark', class: 'dots-back' }
  }
}

const getters = {
  attrsCalendar: (state) => [state.todayAttribute, state.lastVisitedAttribute, state.dotsAttribute]
}

const actions = {
  setDots ({ commit, state }, dates) {
    const calendarDates = []
    if (dates) {
      for (const date of dates) {
        const splittedDate = date.split('-')
        calendarDates.push(
          new Date(+splittedDate[2], splittedDate[1] - 1, +splittedDate[0])
        )
      }
    }
    commit('setDotsDates', calendarDates)
  }
}

const mutations = {
  updateCalendarToday (state) {
    state.todayAttribute.dates = new Date()
  },
  updateCalendarLastVisited (state, date) {
    state.lastVisitedAttribute.dates = new Date(date)
  },
  setDotsDates (state, dates) {
    state.dotsAttribute.dates = dates
  },
  addDot (state, date) {
    const userDate =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    const index = state.dotsAttribute.dates.findIndex((d) => {
      const dotDate =
        d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
      return userDate === dotDate
    })
    if (index !== -1) state.dotsAttribute.dates.push(date)
  },
  deleteDot (state, date) {
    const userDate =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    const index = state.dotsAttribute.dates.findIndex((d) => {
      const dotDate =
        d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear()
      return userDate === dotDate
    })
    if (index !== -1) state.dotsAttribute.dates.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
