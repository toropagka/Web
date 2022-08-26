import * as SLIDES from '@/store/actions/slides.js'

const state = {
  slides: [
    {
      name: 'welcome',
      mode: 'slide',
      visible: JSON.parse(localStorage.getItem('slides'))?.welcome ?? true
    },
    {
      name: 'addAvatar',
      mode: 'slide',
      visible: JSON.parse(localStorage.getItem('slides'))?.addAvatar ?? true
    },
    {
      name: 'addEmployees',
      mode: 'slide',
      visible: JSON.parse(localStorage.getItem('slides'))?.addEmployees ?? true
    },
    {
      name: 'addReglaments',
      mode: 'slide',
      visible: JSON.parse(localStorage.getItem('slides'))?.addReglaments ?? true
    },
    {
      name: 'delegateTasks',
      mode: 'slide',
      visible: JSON.parse(localStorage.getItem('slides'))?.delegateTasks ?? true
    }
  ]
}

const actions = {}

const mutations = {
  [SLIDES.CHANGE_VISIBLE]: (state, value) => {
    for (let i = 0; i < state.slides.length; i++) {
      if (state.slides[i].name === value.name) {
        let data = {}
        try {
          data = JSON.parse(localStorage.getItem('slides'))
          data[value.name] = value.visible
          console.log(data)
        } catch (e) {
          console.log(e)
          data = {
            welcome: true,
            addAvatar: true,
            addEmployees: true,
            addReglaments: true,
            delegateTasks: true
          }
          data[value.name] = value.visible
        }
        state.slides[i].visible = value.visible
        localStorage.setItem('slides', JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem('slides')))
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
