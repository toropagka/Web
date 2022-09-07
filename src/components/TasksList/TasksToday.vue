<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarToday"
      class="pt-[8px]"
      title="Сегодня"
    />
    <TasksListNew hide-nav-bar />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarTasks
  },
  data () {
    return {
      date: new Date()
    }
  },
  mounted () {
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
