<template>
  <div>
    Задачи по регламентам:
    <div
      v-for="item in notificationTasks"
      :key="item.uid"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { NOTIFICATION_TASKS_GENERATE, NOTIFICATION_TASKS_CLEAR } from '@/store/actions/notification_tasks'
export default {
  computed: {
    notificationTasks () {
      return this.$store.state.notificationtasks.notificationtasks
    }
  },
  mounted () {
    const store = useStore()
    store.dispatch(NOTIFICATION_TASKS_GENERATE)
  },
  unmounted () {
    this.$store.dispatch(NOTIFICATION_TASKS_CLEAR)
  }
}
</script>
