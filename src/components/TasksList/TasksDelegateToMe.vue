<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarDelegateToMe"
      class="pt-[8px]"
      :title="'Поручено мне: ' + employeeName"
    />
    <TasksListNew
      hide-input
      hide-nav-bar
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
  computed: {
    employeeUid () {
      return this.$route.params.employee_uid
    },
    employee () {
      const emps = this.$store.state.navigator?.navigator?.new_delegate[1]?.items ?? []
      return emps.find(emp => emp.uid === this.employeeUid)
    },
    employeeName () {
      return this.employee?.name ?? '???'
    }
  },
  watch: {
    employeeUid: {
      handler: function (val) {
        this.selectAnotherEmployee(val)
      }
    }
  },
  mounted () {
    this.selectAnotherEmployee(this.$route.params.employee_uid)
    this.$store.commit('setCalendarLastPicked', null)
  },
  methods: {
    selectAnotherEmployee (uid) {
      this.$store.dispatch(TASK.ACTION_GET_TASK_DELEGATE_ME, uid)
      //
      const navElem = {
        name: this.employee?.name,
        key: 'taskListSource',
        value: { uid: this.employee?.parentID, param: this.employee?.email }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.employee?.parentID, param: this.employee?.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
}
</script>
