<template>
  <div>
    <TasksListNew />
    <PropertiesRight />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import PropertiesRight from '../PropertiesRight.vue'
import * as TASK from '@/store/actions/tasks.js'

export default {
  components: {
    TasksListNew,
    PropertiesRight
  },
  data () {
    return {
      date: new Date()
    }
  },
  computed: {
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    }
  },
  mounted () {
    if (this.isPropertiesMobileExpanded) {
      this.$store.dispatch('asidePropertiesToggle', false)
    }
    if (this.isAsideMobileExpanded) {
      this.$store.dispatch('asideMobileToggle', false)
    }

    this.$store.dispatch(TASK.UNREAD_TASKS_REQUEST)
    const navElem = {
      name: 'Непрочитанные',
      key: 'taskListSource',
      value: { uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89', param: new Date() },
      typeVal: new Date(),
      type: 'date'
    }
    this.$store.commit('updateStackWithInitValue', navElem)
    this.$store.commit('basic', { key: 'taskListSource', value: { uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89', param: null } })
    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}
</script>
