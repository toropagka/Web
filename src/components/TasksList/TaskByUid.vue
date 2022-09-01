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
    const uid = this.$route.params.id
    if (this.$store.state.auth.token) {
      this.$store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
        const navElem = {
          name: 'Поиск',
          key: 'taskListSource',
          value: {
            uid: '47a38aa5-19c4-40d0-b8c0-56c3a420935d',
            param: uid
          }
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', {
          key: 'mainSectionState',
          value: 'tasks'
        })
        this.$store.commit('basic', {
          key: 'taskListSource',
          value: navElem.value
        })

        this.$store.commit('basic', {
          key: 'propertiesState',
          value: 'task'
        })

        if (resp.data.tasks.length > 0) {
          this.$store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
          if (!this.isPropertiesMobileExpanded) {
            this.$store.dispatch('asidePropertiesToggle', true)
          }
        }
      })
    }
  }
}
</script>
