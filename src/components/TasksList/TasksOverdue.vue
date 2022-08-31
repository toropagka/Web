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

export default {
  components: {
    TasksListNew,
    PropertiesRight
  },
  data () {
    return {
      date: new Date(),
      uid: '46418722-a720-4c9e-b255-16db4e590c34',
      label: 'Просроченные'
    }
  },
  mounted () {
    this.$store.dispatch(UID_TO_ACTION[this.uid])
    const navElem = {
      name: this.label,
      key: 'taskListSource',
      value: { uid: this.uid, param: new Date() },
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
