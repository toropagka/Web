<template>
  <div class="flex justify-between items-center">
    <div class="flex flex-col justify-center items-center py-6 px-5 bg-white rounded-lg text-[25px] font-bold grow">
      <div
        class="taskName ring-0 outline-none max-w-7xl mt-0.5 text-center"
      >
        Пройти регламент "{{ name }}"
      </div>
      <button
        class="w-xl-1/6 mt-[35px] w-[238px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[2E2E2E] text-lg px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
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
      this.$router.push('/reglaments/' + this.uid)
      this.$store.state.reglaments.returnDoitnow = true
      this.$store.commit('NAVIGATOR_SUCCESS')
    }
  }
}
</script>
