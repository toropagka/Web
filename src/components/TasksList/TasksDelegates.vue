<template>
  <div class="mr-3">
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import { UID_TO_ACTION } from '@/store/helpers/functions'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    PropertiesRight
  },
  data () {
    return {
      date: new Date(),
      uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89',
      user: null
    }
  },
  computed: {
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    },
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
        // REMOVE: После полного перехода на vue-router возможно стоит убрать. Сейчас это для того, чтобы можно было переходить с '/project/:uid' на другие урлы
        if (this.$route.name === 'delegate-to-me') {
          this.selectAnotherEmployee(toParams.employee_uid)
        }
        if (this.$route.name === 'delegate-by-me') {
          this.selectAnotherEmployee(toParams.employee_uid)
        }
      }
    )
  },
  mounted () {
    this.selectAnotherEmployee(this.$route.params.employee_uid)
  },
  methods: {
    selectAnotherEmployee (uid) {
      const employee = this.$store.state?.employees?.employees[uid]
      this.$store.state.navigator.submenu.status = false
      // если уже выбран - ничего не делаем
      if (this.isUserSelected(employee)) return
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      const action = UID_TO_ACTION[employee?.parentID]
      if (!action) {
        console.error(`assigmentsClick - ${employee?.email} > UID_TO_ACTION[${employee?.parentID}] is null!!!`)
        return
      }
      this.$store.dispatch(action, employee?.uid)
      const navElem = {
        name: employee?.name,
        key: 'taskListSource',
        value: { uid: employee?.parentID, param: employee?.uid }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: employee?.parentID, param: employee?.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    isUserSelected (user) {
      if (
        this.lastNavStack?.value?.uid === user.parentID &&
        this.lastNavStack?.value?.param === user.email
      ) {
        return true
      }
      return false
    }
  }
}
</script>
