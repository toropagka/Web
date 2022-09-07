<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarTask"
      class="pt-[8px]"
      title="Задача"
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

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarTasks
  },
  mounted () {
    const uid = this.$route.params.id
    this.$store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
      if (resp.data.tasks.length > 0) {
        this.$store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
        this.$store.dispatch('asidePropertiesToggle', true)
      }
    })
  }
}
</script>
