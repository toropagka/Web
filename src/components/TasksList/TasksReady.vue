<template>
  <div class="mr-3">
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import * as TASK from '@/store/actions/tasks.js'

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
    this.$store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST)
    const navElem = {
      name: 'Готово к сдаче',
      key: 'taskListSource',
      value: { uid: 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0', param: null },
      typeVal: new Date(),
      type: 'date'
    }
    this.$store.commit('setCalendarLastPicked', null)
    this.$store.commit('updateStackWithInitValue', navElem)
    this.$store.commit('basic', { key: 'taskListSource', value: { uid: 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0', param: null } })
    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}
</script>
