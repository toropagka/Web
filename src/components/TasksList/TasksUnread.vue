<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarUnread"
      class="pt-[8px]"
      title="Непрочитанные"
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
      uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89'
    }
  },
  mounted () {
    this.$store.dispatch(TASK.UNREAD_TASKS_REQUEST)
  }
}
</script>
