<template>
  <div class="flex px-5 justify-between">
    <div class="py-6 px-5 w-5/6 bg-white rounded-lg">
      <div
        class="taskName ring-0 outline-none max-w-7xl mt-0.5 overflow-x-hidden"
      >
        Пройти регламент "{{ name }}"
      </div>
      <button
        class="justify-center cursor-pointer bg-orange-400 text-white mt-8 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
        @click="gotoReglamentContent"
      >
        Пройти регламент
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: null
    },
    uid: {
      type: String,
      default: null
    }
  },
  computed: {
    storeNavigator () {
      return this.$store.state.navigator.navigator
    }
  },
  methods: {
    gotoReglamentContent () {
      this.$router.push('/directory')
      localStorage.setItem('lastTab', 'directory')
      this.$store.state.navigator.lastTab = localStorage.getItem('lastTab')
      this.$store.commit('NAVIGATOR_SUCCESS')
      this.$store.commit('updateStackWithInitValue', {
        name: 'Регламенты',
        key: 'greedSource',
        greedPath: 'reglaments',
        value: this.storeNavigator.reglaments?.items
      })
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.reglaments?.items })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglaments' })
      const reglament = this.$store.state.reglaments.reglaments[this.uid]
      this.$store.commit('basic', {
        key: 'reglamentSource',
        value: { uid: '92413f6c-2ef3-476e-9429-e76d7818685d', param: this.uid }
      })
      const navElem = {
        name: this.name,
        key: 'greedSource',
        uid: this.uid,
        global_property_uid: '92413f6c-2ef3-476e-9429-e76d7818685d',
        greedPath: 'reglament_content',
        value: []
      }
      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: reglament })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglament_content' })
    }
  }
}
</script>
