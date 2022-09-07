<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarSearch"
      class="pt-[8px]"
      :title="'Поиск: ' + searchText"
    />
    <TasksListNew
      hide-input
    />
    <PropertiesRight />
  </div>
</template>
<script>
import TasksListNew from '@/components/TasksListNew.vue'
import PropertiesRight from '@/components/PropertiesRight.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    PropertiesRight,
    NavBarTasks
  },
  computed: {
    searchText () {
      return this.$route.query.q ?? ''
    }
  },
  watch: {
    searchText (text) {
      if (text) {
        this.searchTasks(text)
      }
    }
  },
  mounted () {
    this.searchTasks(this.searchText)
  },
  methods: {
    searchTasks (text) {
      this.$store.dispatch(TASK.SEARCH_TASK, text).then((resp) => {
        console.log('Search Tasks', resp)
      })
    }
  }
}
</script>
