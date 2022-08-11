<template>
  <div>
    Задачи по регламентам
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
import { NOTIFICATION_TASKS_REQUEST, NOTIFICATION_TASKS_CLEAR } from '@/store/actions/notification_tasks'
export default {
  data () {
    return {
      test: 1
    }
  },
  computed: {
    notificationTasks () {
      return this.$store.getters.uncompletedReglaments
    }
  },
  mounted () {
    const store = useStore()
    store.dispatch(NOTIFICATION_TASKS_REQUEST)
  },
  unmounted () {
    this.$store.commit(NOTIFICATION_TASKS_CLEAR)
  }
}
</script>
