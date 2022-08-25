<template>
  <ProjectModalBoxProjectsLimit
    v-if="showProjectsLimit"
    @cancel="showProjectsLimit = false"
    @ok="showProjectsLimit = false"
  />
  <div class="px-3 pt-[25px]">
    <span
      v-if="favoriteProjects.length"
      class="font-['Roboto'] text-[14px] leading-[22px] font-medium text-[#606061]"
    >
      Избранные проекты
    </span>
    <template
      v-for="project in favoriteProjects"
      :key="project.uid"
    >
      <ProjectBlocItem
        :project="project"
        @click="gotoChildren(project)"
      />
    </template>
    <template
      v-for="(value, index) in items"
      :key="index"
    >
      <span class="font-['Roboto'] text-[14px] leading-[22px] mt-[8px] font-medium text-[#606061]">
        {{ value.dep }}
      </span>
      <div
        class="grid gap-2 mt-[5px] grid-cols-1 mb-[30px]"
      >
        <template
          v-for="project in value.items"
          :key="project.uid"
        >
          <ProjectBlocItem
            :project="project"
            @click="gotoChildren(project)"
          />
        </template>
        <InputValue
          v-if="showAddProject && index === 0"
          @save="onAddNewProject"
          @cancel="showAddProject = false"
        />
        <ListBlocAdd
          v-else-if="index == 0"
          @click.stop="clickAddProject"
        />
      </div>
    </template>
  </div>
</template>
<script>
import ProjectBlocItem from '@/components/AsideMenu/ProjectBlocItem.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import InputValue from '@/components/InputValue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import * as TASK from '@/store/actions/tasks'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    ProjectBlocItem,
    InputValue,
    ListBlocAdd,
    ProjectModalBoxProjectsLimit
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['closeSubMenu'],
  data () {
    return {
      showAddProject: false,
      showProjectsLimit: false
    }
  },
  computed: {
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    user () {
      return this.$store.state.user.user
    },
    favoriteProjects () {
      const arr = []
      const projects = this.$store.state.projects.projects
      Object.keys(projects).forEach(key => {
        if (projects[key].favorite === 1) {
          arr.push(projects[key])
        }
      })
      return arr.sort((project1, project2) => { return project1.name.localeCompare(project2.name) })
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    }
  },
  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onAddNewProject (name) {
      this.showAddProject = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.items[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const project = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          email_creator: this.user.current_user_email,
          order: maxOrder + 1,
          comment: '',
          plugin: '',
          collapsed: 0,
          isclosed: 0,
          group: 0,
          show: 1,
          favorite: 0,
          quiet: 0,
          members: [this.user.current_user_email],
          children: [],
          bold: 0
        }
        this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
          // заполняем недостающие параметры
          project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
          project.order = res.data.order
          project.color = '#A998B6'

          this.$store.commit(PROJECT.PUSH_PROJECT, [project])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_PROJECT, [project])
          this.gotoChildren(project)
        })
      }
    },
    clickAddProject () {
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && this.user.days_left <= 0) {
        this.showProjectsLimit = true
        return
      }
      this.showAddProject = true
    },
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
      localStorage.setItem('lastTab', 'tasks')
      this.$emit('closeSubMenu')

      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
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
      localStorage.setItem('lastTab', 'new_private_projects')
      this.$emit('closeSubMenu')
    }
  }
}
</script>
