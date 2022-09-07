<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarByDate"
      class="pt-[8px]"
      :title="dateLabel"
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
  computed: {
    date () {
      return this.$route.params.date
    },
    dateLabel () {
      const date = new Date(this.date)
      const day = date.getDate()
      const month = date.toLocaleString('default', { month: 'short' })
      const weekday = date.toLocaleString('default', { weekday: 'short' })
      const dateLabelFormat = day + ' ' + month + ', ' + weekday
      return dateLabelFormat
    }
  },
  watch: {
    date (newDate) {
      if (newDate) {
        this.loadTasks()
      }
    }
  },
  mounted () {
    this.loadTasks()
  },
  methods: {
    loadTasks () {
      const date = new Date(this.date)
      this.$store.dispatch('TASKS_REQUEST', date)
    }
  }
}
</script>
