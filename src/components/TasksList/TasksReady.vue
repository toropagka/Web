<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarReady"
      class="pt-[8px]"
      title="Готово к сдаче"
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
      uid: 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'
    }
  },
  mounted () {
    this.$store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST)
  }
}
</script>
