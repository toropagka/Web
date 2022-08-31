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
      uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89'
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
  },
  mounted () {
    this.pushToRouter()
    this.$store.state.navigator.submenu.status = false
    // если уже выбран - ничего не делаем
    if (this.isActionSelected(this.uid)) return
    //
    if (this.isPropertiesMobileExpanded) {
      this.$store.dispatch('asidePropertiesToggle', false)
    }
    if (this.isAsideMobileExpanded) {
      this.$store.dispatch('asideMobileToggle', false)
    }
    //
    if (UID_TO_ACTION[this.uid]) {
      this.$store.dispatch(UID_TO_ACTION[this.uid])
      const navElem = {
        name: 'Непрочитанные',
        key: 'taskListSource',
        value: { uid: this.uid, param: new Date() },
        typeVal: new Date(),
        type: 'date'
      }
      this.$store.commit('setCalendarLastPicked', null)
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.uid, param: null } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    } else {
      console.error(`gotoAction - ${'Непрочитанные'} > UID_TO_ACTION[${this.uid}] is null!!!`)
    }
  },
  methods: {
    pushToRouter () {
      localStorage.setItem('lastTab', 'tasks')
      this.$router.push('/tasks')
    },
    isActionSelected (uid) {
      return this.lastNavStack?.value?.uid === uid
    }
  }
}
</script>
