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
      uid: '',
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
        if (this.$route.name === 'tasksDelegateToMe' || this.$route.name === 'tasksDelegateByMe') {
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
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      if (this.$route.name === 'tasksDelegateToMe') {
        this.uid = '511d871c-c5e9-43f0-8b4c-e8c447e1a823'
      }
      if (this.$route.name === 'tasksDelegateByMe') {
        this.uid = '169d728b-b88b-462d-bd8e-3ac76806605b'
      }
      const action = UID_TO_ACTION[this.uid]
      this.$store.dispatch(action, employee?.email)
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
