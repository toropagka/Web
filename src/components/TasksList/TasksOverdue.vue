<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarOverdue"
      class="pt-[8px]"
      title="Просроченные"
    />
    <TasksListNew
      hide-input
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
    this.$store.commit('setCalendarLastPicked', null)
  }
}
</script>
