<template>
  <div class="mr-3">
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'

export default {
  components: {
    TasksListNew,
    PropertiesRight
  },
  computed: {
    date () {
      return this.$route.params.date
    }
  },
  watch: {
    date (newDate) {
      if (newDate) {
        this.loadTasks()
      }
    }
  },
  mounted () {
    this.loadTasks()
  },
  methods: {
    loadTasks () {
      const date = new Date(this.date)
      const day = date.getDate()
      const month = date.toLocaleString('default', { month: 'short' })
      const weekday = date.toLocaleString('default', { weekday: 'short' })
      const dateLabelFormat = day + ' ' + month + ', ' + weekday
      const navElem = {
        name: dateLabelFormat,
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: date },
        typeVal: date,
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.dispatch('TASKS_REQUEST', date)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: date } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    }
  }
}
</script>
