<template>
  <div class="flex justify-between items-center pt-2">
    <NavbarSearchLimit
      v-if="showFreeModal"
      @cancel="showFreeModal = false"
    />
    <NavBarVueRouter />
    <div class="flex gap-[10px] items-center px-3">
      <div
        v-if="!showSearchBar"
        class="flex-none flex gap-[5px] p-[8px] cursor-pointer text-[#7e7e80] hover:text-[#7e7e80]/75"
        @click="onShowSearchBar"
      >
        <svg
          class="flex-none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
            fill="currentColor"
          />
        </svg>
        <p class="font-roboto text-[14px]">
          Поиск
        </p>
      </div>
      <div
        v-if="showSearchBar"
        class="flex-none flex gap-[5px] items-center h-[40px] w-[160px] overflow-hidden px-[8px] text-[#7e7e80] bg-white rounded-[10px]"
      >
        <svg
          class="flex-none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
            fill="currentColor"
          />
        </svg>
        <input
          ref="searchInput"
          v-model="searchText"
          maxlength="100"
          type="text"
          class="w-full font-roboto text-[14px] leading-[16px] border-0 focus:ring-0 p-0"
          @keyup.enter="sendSearchRequest"
          @blur="onBlurSearchInput"
        >
        <svg
          v-if="searchText"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          class="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          data-v-1ded894d=""
          @click="erase"
        >
          <path
            d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
            fill="black"
            fill-opacity="0.5"
            data-v-1ded894d=""
          />
        </svg>
      </div>
      <NavBarButtonsProject
        :project-uid="currentProject.uid"
        :show-completed-tasks="showCompletedTasks"
        @popNavBar="popNavBar"
        @toggleCompletedTasks="onChangeCompletedTasks"
      />
    </div>
  </div>
  <div
    class="w-full"
  >
    <div class="grid gap-2 mt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
      <TasksListNew
        class="pt-[0px]"
        hide-nav-bar="true"
      />
    </div>
  </div>
</template>

<script>
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import TasksListNew from '@/components/TasksListNew.vue'
import * as TASK from '@/store/actions/tasks'
import * as PROJECT from '@/store/actions/projects.js'
import * as NAVIGATOR from '@/store/actions/navigator.js'

import { uuidv4, getNavstackPath } from '@/helpers/functions'
import NavBarVueRouter from '../NavBarVueRouter.vue'
import { mapMutations } from 'vuex'
import NavBarButtonsProject from '../Navbar/NavBarButtonsProject.vue'
import { notify } from 'notiwind'

export default {
  components: {
    ProjectBlocItem,
    TasksListNew,
    NavBarVueRouter,
    NavBarButtonsProject
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
      showFreeModal: false,
      showSearchBar: false,
      searchText: '',
      currentProject: {}
    }
  },
  computed: {
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentProject?.email_creator === user.current_user_email
    },
    settings () {
      return this.$store.state.navigator.navigator.settings
    },
    showCompletedTasks () {
      return this.settings?.show_completed_tasks ?? false
    },
    user () {
      return this.$store.state.user.user
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
    this.$store.state.navigator.lastTab = 'new_private_projects'
    if (!Object.keys(this.$store.state.projects.projects).includes(this.$route.params.project_id)) {
      this.$router.push('/projects')
      return
    }
    this.selectAnotherProject(this.$route.params.project_id)
    this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, this.currentProject.uid)
    this.$store.commit('basic', {
      key: 'taskListSource',
      value: { uid: this.currentProject.global_property_uid, param: this.currentProject.uid }
    })

    this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)

    this.$store.commit('basic', { key: 'greedSource', value: this.currentProject.children })
    this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
  },
  methods: {
    ...mapMutations('navbarVueRouter', {
      setBreadcrumbs: 'set'
    }),
    print (msg, val) {
      console.log(msg, val)
    },
    getProjectsNavstackPath (uid) {
      const projects = this.$store.state.navigator.navigator.new_private_projects
      for (let i = 0; i < projects.length; i++) {
        for (let j = 0; j < projects[i].items.length; j++) {
          const pathProjects = getNavstackPath(projects[i].items[j], uid)

          if (pathProjects && pathProjects.length) {
            return pathProjects
          }
        }
      }
      return []
    },
    onShowSearchBar () {
      if (this.user.tarif === 'free') {
        this.showFreeModal = true
        return
      }
      this.showSearchBar = true
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    },
    selectAnotherProject (uid) {
      // Вычисляем навстак
      const pathProjects = this.getProjectsNavstackPath(uid)
      this.setBreadcrumbs([
        {
          name: 'Проекты'
        },
        ...pathProjects
      ])

      console.log(pathProjects)
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
    },
    // Перенёс логику из старого навбара, по-хорошему надо отрефакторить
    popNavBar () {
      this.$store.dispatch('popNavStack')
    },
    updateSettings () {
      this.$store.dispatch(
        NAVIGATOR.PATCH_SETTINGS,
        {
          show_completed_tasks: this.settings.show_completed_tasks ? 1 : 0,
          add_task_to_begin: this.settings.add_task_to_begin ? 1 : 0,
          cal_number_of_first_week: this.settings.cal_number_of_first_week ? 1 : 0,
          cal_show_week_number: this.settings.cal_show_week_number ? 1 : 0,
          nav_show_tags: this.settings.nav_show_tags ? 1 : 0,
          nav_show_overdue: this.settings.nav_show_overdue ? 1 : 0,
          nav_show_summary: this.settings.nav_show_summary ? 1 : 0,
          nav_show_emps: this.settings.nav_show_emps ? 1 : 0,
          nav_show_markers: this.settings.nav_show_markers ? 1 : 0,
          language: this.settings.language,
          stopwatch: this.settings.stopwatch ? 1 : 0,
          cal_work_time: this.settings.cal_work_time,
          reminders_in_n_minutes: this.settings.reminders_in_n_minutes,
          cal_work_week: this.settings.cal_work_week,
          compact_mode: this.settings.compact_mode ? 1 : 0
        }
      ).then(() => {
        if (this.$store.state.auth.token) {
          this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, this.currentProject.uid)
          this.$store.commit('basic', { key: 'taskListSource', value: { uid: this.currentProject.global_property_uid, param: this.currentProject.uid } })
          this.$store.commit('basic', { key: 'greedPath', value: 'projects_children' })
          this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        }
      })
    },
    onChangeCompletedTasks () {
      this.settings.show_completed_tasks = !this.showCompletedTasks
      this.updateSettings()
    },
    sendSearchRequest () {
      if (this.searchText.length > 3) {
        // поиск задачи по ссылке из лидертаска настольного
        if (this.searchText.startsWith('lt://planning?{')) {
          const taskUid = this.searchText.slice(15, -1).toLowerCase()
          const link = `${window.location.origin}/task/${taskUid}`
          window.location = link
        }

        this.$router.push({ path: '/search', query: { q: this.searchText } })
      } else {
        notify(
          {
            group: 'api',
            title: 'Длина запроса должна быть более 3 символов',
            action: '',
            text: ''
          },
          15000
        )
      }
    }
  }
}
</script>

<style scoped></style>
