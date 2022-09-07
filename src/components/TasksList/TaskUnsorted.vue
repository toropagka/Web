<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarUnsorted"
      class="pt-[8px]"
      title="Неразобранные"
    />
    <TasksListNew hide-nav-bar />
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
  data () {
    return {
      date: new Date(),
      uid: '5183b619-3968-4c3a-8d87-3190cfaab014'
    }
  },
  mounted () {
    this.$store.dispatch(TASK.UNSORTED_TASKS_REQUEST)
    const navElem = {
      name: 'Неразобранные',
      key: 'taskListSource',
      value: { uid: this.uid, param: null },
      typeVal: new Date(),
      type: 'date'
    }
    this.$store.commit('setCalendarLastPicked', null)
    this.$store.commit('updateStackWithInitValue', navElem)
    this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.uid, param: null } })
    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
  }
}
</script>
