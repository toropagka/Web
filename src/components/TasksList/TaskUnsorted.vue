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
      uid: '5183b619-3968-4c3a-8d87-3190cfaab014'
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
    if (UID_TO_ACTION[this.uid]) {
      this.$store.dispatch(UID_TO_ACTION[this.uid])
      const navElem = {
        name: 'Неразобранные',
        key: 'taskListSource',
        value: { uid: this.uid, param: new Date(this.date) },
        typeVal: new Date(this.date),
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.uid, param: null } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    }
  }
}
</script>
