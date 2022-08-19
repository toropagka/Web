<template>
  <div class="px-3">
    <template
      v-for="(value, idx) in items"
      :key="idx"
    >
      <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold py-3 mt-[10px]">
        {{ value.dep }}
      </p>
      <div
        class="grid gap-2 mt-[5px] grid-cols-1"
      >
        <template
          v-for="project in value.items"
          :key="project.uid"
        >
          <ProjectBlocItem
            :project="project"
            @click.stop="gotoChildren(project)"
          />
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    ProjectBlocItem
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['closeSubMenu'],
  computed: {
    storeNavigator () {
      return this.$store.state.navigator.navigator
    }
  },
  methods: {
    mainStateUpdate () {
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'new_private_projects' })
      const navElem = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: 'new_private_projects',
        value: this.storeNavigator.new_private_projects?.items
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.new_private_projects?.items })
    },
    gotoChildren (project) {
      this.mainStateUpdate()
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
      this.$emit('closeSubMenu')
    }
  }
}
</script>
