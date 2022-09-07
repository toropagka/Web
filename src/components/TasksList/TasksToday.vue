<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarToday"
      class="pt-[8px]"
      title="Сегодня"
    />
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarTasks
  },
  data () {
    return {
      date: new Date()
    }
  },
  mounted () {
    this.$store.dispatch('TASKS_REQUEST', new Date(this.date))
  }
}
</script>
