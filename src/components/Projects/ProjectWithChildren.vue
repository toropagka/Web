<template>
  <NavBar />
  <div
    class="w-full pt-[45px]"
  >
    <div class="grid gap-2 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <template
        v-for="project in currentProject.children"
        :key="project.uid"
      >
        <router-link :to="'/project/' + project.uid">
          <ProjectBlocItem
            :project="project"
          />
        </router-link>
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
import * as PROJECT from '@/store/actions/projects.js'
import * as NAVIGATOR from '@/store/actions/navigator.js'

import NavBar from '@/components/NavBar.vue'
import { uuidv4 } from '@/helpers/functions'

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
  data () {
    return {
      showAdd: false,
      showProjectsLimit: false,
      currentProject: {}
    }
  },
  computed: {
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentProject?.email_creator === user.current_user_email
    }
  },
  /**
   * TODO: выяснить, почему рендерит 2 раза
   */
  created () {
    this.$watch(
      () => this.$route.params,
      (toParams) => {
        // REMOVE: После полного перехода на vue-router возможно стоит убрать. Сейчас это для того, чтобы можно было переходить с '/project/:uid' на другие урлы
        if (this.$route.name === 'project') {
          this.selectAnotherProject(toParams.project_id)
        }
      }
    )
  },
  mounted () {
    this.selectAnotherProject(this.$route.params.project_id)
  },
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    selectAnotherProject (uid) {
      const navElemRoot = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: 'new_private_projects',
        value: this.$store.state.navigator.navigator.new_private_projects?.items
      }
      this.$store.commit('updateStackWithInitValue', navElemRoot)
      this.currentProject = this.$store.state.projects.projects[uid]

      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'new_private_projects' })
      this.$store.commit('basic', { key: 'greedSource', value: this.$store.state.navigator.navigator.new_private_projects?.items })

      this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, this.currentProject.uid)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: this.currentProject.global_property_uid, param: this.currentProject.uid }
      })

      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

      const navElem = {
        name: this.currentProject.name,
        key: 'greedSource',
        uid: this.currentProject.uid,
        global_property_uid: this.currentProject.global_property_uid,
        greedPath: 'projects_children',
        value: this.currentProject.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.currentProject.children })
      this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
    },
    clickAddProject () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && user.days_left <= 0) {
        this.showProjectsLimit = true
        return
      }
      this.showAdd = true
    },
    onAddNewProject (name) {
      this.showAdd = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.currentProject?.children?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) ?? 0
        const user = this.$store.state.user.user

        const project = {
          uid: uuidv4(),
          name: title,
          uid_parent: this.currentProject?.uid ?? '00000000-0000-0000-0000-000000000000',
          email_creator: user.current_user_email,
          order: maxOrder + 1,
          comment: '',
          plugin: '',
          collapsed: 0,
          isclosed: 0,
          group: 0,
          show: 1,
          favorite: 0,
          quiet: 0,
          members: [user.current_user_email],
          children: [],
          bold: 0
        }
        console.log(`create project uid: ${project.uid}`, project)

        this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
          // заполняем недостающие параметры
          project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
          project.order = res.data.order
          project.color = '#A998B6'

          this.$store.commit(PROJECT.PUSH_PROJECT, [project])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_PROJECT, [project])
          this.$router.push('/project/' + project.uid)
        })
      }
    }
  }
}
</script>

<style scoped></style>
