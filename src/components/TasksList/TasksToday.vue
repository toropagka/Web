<template>
  <div class="mr-3">
    <TasksListNew />
    <properties-right />
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
  data () {
    return {
      date: new Date()
    }
  },
  mounted () {
    if (this.isPropertiesMobileExpanded) {
      this.$store.dispatch('asidePropertiesToggle', false)
    }
    if (this.isAsideMobileExpanded) {
      this.$store.dispatch('asideMobileToggle', false)
    }

    this.$store.dispatch('TASKS_REQUEST', new Date(this.date))
    const day = this.date.getDate()
    const month = this.date.toLocaleString('default', { month: 'short' })
    const weekday = this.date.toLocaleString('default', { weekday: 'short' })
    const dateLabelFormat = day + ' ' + month + ', ' + weekday
    const navElem = {
      name: dateLabelFormat,
      key: 'taskListSource',
      value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(this.date) },
      typeVal: new Date(this.date),
      type: 'date'
    }
    this.$store.commit('setCalendarLastPicked', this.date)
    this.$store.commit('updateStackWithInitValue', navElem)
    this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(this.date) } })
    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}
</script>
