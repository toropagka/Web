<template>
  <div class="mr-3">
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    PropertiesRight
  },
  data () {
    return {
      date: new Date(),
      uid: '',
      user: null
    }
  },
  computed: {
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    }
    // employee () {
    //   return this.$store.state?.employees?.employees[this.$route?.params?.employee_uid]
    // }
  },
  created () {
    this.$watch(
      () => this.$route.params,
      (toParams) => {
        if (this.$route.name === 'tasksDelegateToMe' || this.$route.name === 'tasksDelegateByMe') {
          this.selectAnotherEmployee(toParams.employee_uid)
        }
      }
    )
  },
  mounted () {
    this.selectAnotherEmployee(this.$route.params.employee_uid)
    this.$store.commit('setCalendarLastPicked', null)
  },
  methods: {
    selectAnotherEmployee (uid) {
      const employee = this.$store.state?.employees?.employees[uid]
      this.$store.state.navigator.submenu.status = false
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      if (this.$route.name === 'tasksDelegateToMe') {
        this.$store.dispatch(TASK.ACTION_GET_TASK_DELEGATE_ME, uid)
      }
      if (this.$route.name === 'tasksDelegateByMe') {
        this.$store.dispatch(TASK.ACTION_GET_TASKS_DELEGATED_BY_ME, uid)
      }
      const navElem = {
        name: employee?.name,
        key: 'taskListSource',
        value: { uid: employee?.parentID, param: employee?.email }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: employee?.parentID, param: employee?.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
      localStorage.setItem('lastTab', 'tasks')
    }
  }
}
</script>
