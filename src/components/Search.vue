<template>
  <div class="mt-3 mr-3">
    <NavBarVueRouter class="mb-3" />
    <TasksListNew hide-nav-bar />
    <PropertiesRight />
  </div>
</template>
<script>
import TasksListNew from '@/components/TasksListNew.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import NavBarVueRouter from '@/components/NavBarVueRouter.vue'

import * as TASK from '@/store/actions/tasks'

import { mapMutations } from 'vuex'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarVueRouter
  },
  computed: {
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    searchText () {
      return this.$route.query.q ?? ''
    }
  },
  mounted () {
    this.setBreadcrumbs([{
      name: 'Поиск: ' + this.searchText
    }])

    this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    this.$store.commit('basic', {
      key: 'taskListSource',
      value: {
        uid: '11212e94-cedf-11ec-9d64-0242ac120002',
        param: this.searchText
      }
    })

    this.$store.dispatch(TASK.SEARCH_TASK, this.searchText).then((resp) => {
      console.log('Search Tasks', resp)
    })
  },
  methods: {
    ...mapMutations('navbarVueRouter', {
      setBreadcrumbs: 'set'
    })
  }
}
</script>
