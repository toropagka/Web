<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarOverdue"
      class="pt-[8px]"
      title="Просроченные"
    />
    <TasksListNew
      hide-input
      hide-nav-bar
    />
    <PropertiesRight />
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
      uid: '46418722-a720-4c9e-b255-16db4e590c34'
    }
  },
  mounted () {
    this.$store.dispatch(TASK.OVERDUE_TASKS_REQUEST)
    const navElem = {
      name: 'Просроченные',
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
