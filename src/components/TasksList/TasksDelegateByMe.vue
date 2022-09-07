<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarDelegateByMe"
      class="pt-[8px]"
      :title="'Поручено мной: ' + employeeName"
    />
    <TasksListNew />
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
      // сделано так, потому что у нас могут быть поручения сотрудникам
      // не из нашей организации
      const emps = this.$store.state.navigator?.navigator?.new_delegate[0]?.items ?? []
      const emp = emps.find(emp => emp.uid === this.employeeUid)
      if (emp) return emp
      //
      const emps2 = this.$store.state.navigator?.navigator?.delegate_iam?.items ?? []
      const emp2 = emps2.find(emp => emp.uid === this.employeeUid)
      if (emp2) return emp2
      //
      const emps3 = this.$store.state.employees?.employees ?? {}
      return emps3[this.employeeUid]
    },
    employeeName () {
      return this.employee?.name ?? '???'
    }
  },
  watch: {
    employeeUid: {
      handler: function (val) {
        if (val) this.selectAnotherEmployee(val)
      }
    }
  },
  mounted () {
    this.selectAnotherEmployee(this.employeeUid)
    this.$store.commit('setCalendarLastPicked', null)
  },
  methods: {
    selectAnotherEmployee (uid) {
      this.$store.dispatch(TASK.ACTION_GET_TASKS_DELEGATED_BY_ME, uid)
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
