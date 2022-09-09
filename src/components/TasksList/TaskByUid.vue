<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarTask"
      class="pt-[8px]"
      title="Задача"
      @reload="reload"
    />
    <TasksListNew
      hide-input
    />
  </div>
</template>
<script>
import TasksListNew from '../TasksListNew.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    NavBarTasks
  },
  mounted () {
    this.reload()
  },
  methods: {
    reload () {
      const uid = this.$route.params.id
      this.$store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
        if (resp.data.tasks.length > 0) {
          this.$store.commit('basic', { key: 'propertiesState', value: 'task' })
          this.$store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
          this.$store.dispatch('asidePropertiesToggle', true)
        }
      })
    }
  }
}
</script>
