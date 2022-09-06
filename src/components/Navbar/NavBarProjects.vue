<template>
  <NavBar
    id="NavBarProjects"
    title="Проекты"
    route="/project"
    :breadcrumbs="breadcrumbs"
  >
    <NavBarSearch
      @search="onSearch"
    />
    <NavBarButtonsProject
      :project-uid="projectUid"
      :show-completed-tasks="showCompletedTasks"
      @popNavBar="popNavBar"
      @toggleCompletedTasks="onChangeCompletedTasks"
    />
  </NavBar>
</template>

<script>
import { PATCH_SETTINGS, NAVIGATOR_UPDATE_ASSIGNMENTS } from '@/store/actions/navigator'
import { SEARCH_TASK } from '@/store/actions/tasks'
import { notify } from 'notiwind'

import NavBarButtonsProject from '@/components/Navbar/NavBarButtonsProject.vue'
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import NavBar from '@/components/Navbar/NavBar.vue'

export default {
  components: {
    NavBarButtonsProject,
    NavBarSearch,
    NavBar
  },
  props: {
    projectUid: {
      type: String,
      default: ''
    }
  },
  computed: {
    projects () {
      return this.$store.state.projects.projects
    },
    breadcrumbs () {
      let project = this.projects[this.projectUid]
      if (!project) return [{ name: '???', selected: true }]

      const arrResult = [
        { name: project.name, selected: true } // на самого себя нажать нельзя по этому не добавляем to
      ]

      project = this.projects[project.uid_parent]
      while (project) {
        arrResult.unshift({ name: project.name, to: `/project/${project.uid}`, showNext: true })
        project = this.projects[project.uid_parent]
      }

      return arrResult
    },
    settings () {
      return this.$store.state.navigator.navigator.settings
    },
    showCompletedTasks () {
      return this.settings?.show_completed_tasks ?? false
    }
  },
  methods: {
    popNavBar () {
      const prevIndex = this.breadcrumbs.length - 2
      const to = prevIndex >= 0 ? this.breadcrumbs[prevIndex].to : null
      this.$router.push(to || '/project')
    },
    onSearch (text) {
      if (text.length > 3) {
        // поиск задачи по ссылке из лидертаска настольного
        if (text.startsWith('lt://planning?{')) {
          const taskUid = text.slice(15, -1).toLowerCase()
          const link = `${window.location.origin}/task/${taskUid}`
          window.location = link
          return
        }
        const navElem = {
          name: 'Поиск: ' + text,
          key: 'taskListSource',
          value: { uid: '11212e94-cedf-11ec-9d64-0242ac120002', param: text }
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
        this.$store.commit('basic', { key: 'taskListSource', value: navElem.value })
        this.$store.dispatch(SEARCH_TASK, text).then((resp) => {
          console.log('Search Tasks', resp)
        })
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
    },
    updateSettings () {
      this.$store.dispatch(
        PATCH_SETTINGS,
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
        this.requestLastVisitedNav()
        this.$store.dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
      })
    },
    onChangeCompletedTasks () {
      this.settings.show_completed_tasks = !this.showCompletedTasks
      this.updateSettings()
    }
  }
}
</script>
