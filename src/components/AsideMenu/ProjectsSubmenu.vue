<template>
  <ProjectModalBoxProjectsLimit
    v-if="showProjectsLimit"
    @cancel="showProjectsLimit = false"
    @ok="showProjectsLimit = false"
  />
  <div class="px-[16px] pt-[15px]">
    <AsideMenuListSkeleton v-if="status == 'loading'" />
    <template v-if="status == 'success'">
      <AsideMenuListTitle v-if="favoriteProjects.length">
        Избранные проекты
      </AsideMenuListTitle>
      <template
        v-for="project in favoriteProjects"
        :key="project.uid"
      >
        <router-link
          v-slot="{ isActive }"
          :to="'/project/' + project.uid"
        >
          <ProjectsSubmenuItem
            :project="project"
            :selected="isActive"
            @click="closeMenu"
          />
        </router-link>
      </template>
      <template
        v-for="(value, index) in items"
        :key="index"
      >
        <AsideMenuListTitle>
          {{ value.dep }}
        </AsideMenuListTitle>
        <template
          v-for="project in value.items"
          :key="project.uid"
        >
          <router-link
            v-slot="{ isActive }"
            :to="'/project/' + project.uid"
          >
            <ProjectsSubmenuItem
              :selected="isActive"
              :project="project"
              @click="closeMenu"
            />
          </router-link>
        </template>
        <AsideMenuListInput
          v-if="showAddProject && index == 0"
          class="mb-[16px]"
          :show="showAddProject"
          @cancel="showAddProject = false"
          @save="onAddNewProject"
        >
          <svg
            class="flex-none"
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6486 5.13099V4.19718C16.6486 3.33099 15.9668 2.62535 15.1299 2.62535H8.87113L8.68333 2.30423C8.56901 2.11831 8.36896 2 8.15666 2H3.51875C2.68181 2 2 2.70563 2 3.57183V15.4282C2 16.2944 2.68181 17 3.51875 17H16.4812C17.3182 17 18 16.2944 18 15.4282V6.69437C18.0041 5.8831 17.408 5.21549 16.6486 5.13099ZM3.23297 3.57183C3.23297 3.40704 3.36361 3.27183 3.52284 3.27183H7.81372L9.47945 6.08592C9.58968 6.27183 9.78973 6.39014 10.0061 6.39014H16.4894C16.6486 6.39014 16.7793 6.52535 16.7793 6.69014V15.4282C16.7793 15.593 16.6486 15.7282 16.4894 15.7282H3.51875C3.35953 15.7282 3.22888 15.593 3.22888 15.4282V3.57183H3.23297ZM15.4157 5.11831H10.345L9.62234 3.89718H15.1258C15.285 3.89718 15.4157 4.03239 15.4157 4.19718V5.11831Z"
              fill="currentColor"
            />
          </svg>
        </AsideMenuListInput>
        <AsideMenuListAdd
          v-else-if="index == 0"
          class="mb-[16px]"
          title="Добавить проект"
          @click.stop="clickAddProject"
        />
      </template>
    </template>
  </div>
</template>

<script>
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import AsideMenuListTitle from '@/components/AsideMenu/AsideMenuListTitle.vue'
import AsideMenuListAdd from '@/components/AsideMenu/AsideMenuListAdd.vue'
import AsideMenuListInput from '@/components/AsideMenu/AsideMenuListInput.vue'
import ProjectsSubmenuItem from '@/components/AsideMenu/ProjectsSubmenuItem.vue'
import AsideMenuListSkeleton from '@/components/AsideMenu/AsideMenuListSkeleton.vue'
import { uuidv4 } from '@/helpers/functions'

import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    ProjectModalBoxProjectsLimit,
    AsideMenuListTitle,
    ProjectsSubmenuItem,
    AsideMenuListAdd,
    AsideMenuListInput,
    AsideMenuListSkeleton
  },
  data () {
    return {
      showAddProject: false,
      showProjectsLimit: false
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
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
    },
    items () {
      return this.storeNavigator?.new_private_projects ?? []
    }
  },
  methods: {
    pushToRouter () {
      localStorage.setItem('lastTab', 'new_private_projects')
      this.$router.push('/tasks')
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
          uid: uuidv4(),
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
          this.$router.push('/project/' + project.uid)
          this.$store.state.navigator.submenu.status = false
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
    closeMenu () {
      this.$store.state.navigator.submenu.status = false
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
    }
  }
}
</script>
