<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxRename
      v-if="showAdd"
      :show="showAdd"
      title="Добавить подпроект"
      @cancel="showAdd = false"
      @save="onAddNewProject"
    />
    <ProjectModalBoxProjectsLimit
      v-if="showProjectsLimit"
      @cancel="showProjectsLimit = false"
      @ok="showProjectsLimit = false"
    />
    <BoardModalBoxDelete
      v-if="showDeleteProject"
      title="Удалить проект"
      :text="deleteMessage"
      @cancel="showDeleteProject = false"
      @yes="onDeleteProject"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          @click="clickCompletedTasks"
        >
          {{ showCompletedTasks ? 'Скрыть завершенные задачи' : 'Показать завершенные задачи' }}
        </PopMenuItem>
        <PopMenuDivider />
        <PopMenuItem
          icon="edit"
          @click="clickEditProject"
        >
          Свойства проекта
        </PopMenuItem>
        <PopMenuItem
          v-if="canAddChild"
          icon="add"
          @click="clickAddProject"
        >
          Создать подпроект
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          @click="clickDeleteProject"
        >
          Удалить проект
        </PopMenuItem>
        <PopMenuItem
          @click="favoriteToggle"
        >
          {{ !isFavorite ? 'Добавить в избранное' : 'Удалить из избранного' }}
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'
import * as TASK from '@/store/actions/tasks'

import {
  ADD_PROJECT_TO_FAVORITE,
  REMOVE_PROJECT_FROM_FAVORITE,
  REMOVE_PROJECT_REQUEST,
  SELECT_PROJECT
} from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    BoardModalBoxRename,
    ProjectModalBoxProjectsLimit,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    projectUid: {
      type: String,
      default: ''
    },
    showCompletedTasks: {
      type: Boolean,
      default: false
    }
  },
  emits: ['popNavBar', 'toggleCompletedTasks'],
  data () {
    return {
      showDeleteProject: false,
      showAdd: false,
      showProjectsLimit: false
    }
  },
  computed: {
    deleteMessage () {
      if (this.project.children.length !== 0) {
        return 'Вы действительно хотите удалить проект? \n\n Внимание! Все дочерние проекты будут удалены.'
      }
      return 'Вы действительно хотите удалить проект?'
    },
    project () {
      return this.$store.state.projects.projects[this.projectUid]
    },
    currentProject () {
      const projects = this.$store.state.projects.projects
      const navStack = this.$store.state.navbar.navStack
      const currProjectUid = navStack[navStack.length - 1].uid
      const project = projects[currProjectUid]
      return project
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentProject?.email_creator === user.current_user_email
    },
    canDelete () {
      return this.project?.email_creator === this.$store.state.user?.user?.current_user_email
    },
    isFavorite () {
      return this.project?.favorite
    }
  },
  methods: {
    clickEditProject () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'project' })
      this.$store.commit(SELECT_PROJECT, this.project)
    },
    clickDeleteProject () {
      this.showDeleteProject = true
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
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
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
          uid: this.uuidv4(),
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
          this.gotoChildren(project)
        })
      }
    },
    onDeleteProject () {
      this.showDeleteProject = false
      //
      this.$store.dispatch(REMOVE_PROJECT_REQUEST, this.projectUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(SELECT_PROJECT, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.project)
          // для актуального значения количества проектов
          this.$store.commit(REMOVE_PROJECT_REQUEST, this.projectUid)
          //
          this.$emit('popNavBar')
        })
    },
    clickCompletedTasks () {
      this.$emit('toggleCompletedTasks')
    },
    favoriteToggle () {
      if (!this.isFavorite) {
        this.$store.dispatch(ADD_PROJECT_TO_FAVORITE, this.project)
          .then(res => {
            this.project.favorite = res.data.favorite
          })
      } else {
        this.$store.dispatch(REMOVE_PROJECT_FROM_FAVORITE, this.project)
          .then(res => {
            this.project.favorite = res.data.favorite
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
