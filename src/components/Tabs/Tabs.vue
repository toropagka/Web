<template>
  <div class="w-full flex justify-around">
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="bg-white rounded w-2/6 text-center text-[15px] p-2 leading-[18px] text-[#4c4c4d] font-roboto font-medium"
      @click="switchTab(tab.code)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabs: [
        {
          code: 1,
          name: 'Задачи'
        },
        {
          code: 2,
          name: 'Справочникик'
        }
      ]
    }
  },
  methods: {
    switchTab (code) {
      localStorage.setItem('lastTab', code)
      this.$store.state.navigator.lastTab = localStorage.getItem('lastTab')
    }
  }
}
</script>
