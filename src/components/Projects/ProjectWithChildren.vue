<template>
  <NavBar />
  <div
    class="w-full pt-[45px]"
  >
    <div class="grid gap-2 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <template
        v-for="project in projects"
        :key="project.uid"
      >
        <ProjectBlocItem
          :project="project"
          @click.stop="gotoChildren(project)"
        />
      </template>
    </div>
    <div class="mt-2">
      <TasksListNew class="pt-[0px]" />
    </div>
  </div>
</template>

<script>
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import TasksListNew from '@/components/TasksListNew.vue'
import * as TASK from '@/store/actions/tasks'

import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    ProjectBlocItem,
    TasksListNew,
    NavBar
  },
  props: {
    projects: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    gotoChildren (project) {
      this.$store.dispatch('asidePropertiesToggle', false)

      this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, project.uid)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: project.global_property_uid, param: project.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: project.global_property_uid,
        greedPath: 'projects_children',
        value: project.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: project.children })
      this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
    }
  }
}
</script>

<style scoped></style>
