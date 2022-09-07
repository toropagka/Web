<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarInFocus"
      class="pt-[8px]"
      title="Задачи в фокусе"
    />
    <TasksListNew />
    <propertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

import * as TASK from '@/store/actions/tasks.js'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarTasks
  },
  data () {
    return {
      date: new Date(),
      uid: '6fc44cc6-9d45-4052-917e-25b1189ab141'
    }
  },
  mounted () {
    this.$store.dispatch(TASK.IN_FOCUS_TASKS_REQUEST)
    const navElem = {
      name: 'В фокусе',
      key: 'taskListSource',
      value: { uid: this.uid, param: null },
      typeVal: new Date(),
      type: 'date'
    }
    this.$store.commit('setCalendarLastPicked', null)
    this.$store.commit('updateStackWithInitValue', navElem)
    this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.uid, param: null } })
    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}

</script>
