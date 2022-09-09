<template>
  <div class="w-full">
    <div class="flex items-center justify-between w-full pt-[8px]">
      <NavBar
        class="w-full"
        title="Проекты"
      />
      <div
        class="flex flex-none"
      >
        <icon
          :path="listView.path"
          :width="listView.width"
          :height="listView.height"
          :box="listView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2"
          :class="{
            'text-gray-800': !isGridView,
            'text-gray-400': isGridView
          }"
          @click="updateGridView(false)"
        />
        <icon
          :path="gridView.path"
          :width="gridView.width"
          :height="gridView.height"
          :box="gridView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2"
          :class="{
            'text-gray-800': isGridView,
            'text-gray-400': !isGridView
          }"
          @click="updateGridView(true)"
        />
      </div>
    </div>
    <div v-if="!displayModal">
      <ProjectModalBoxProjectsLimit
        v-if="showProjectsLimit"
        @cancel="showProjectsLimit = false"
        @ok="showProjectsLimit = false"
      />
      <div
        v-for="(value, index) in items"
        :key="index"
      >
        <div
          class="flex items-center w-full"
          :class="{ 'justify-between': index == 0, 'mt-[28px]': index == 1 }"
        >
          <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
            {{ value.dep }}
          </p>
        </div>
        <div
          class="grid gap-2 mt-3 grid-cols-1"
          :class="{
            'md:grid-cols-2 lg:grid-cols-4': isGridView,
            'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
          }"
        >
          <template
            v-for="project in value.items"
            :key="project.uid"
          >
            <router-link
              :to="'/project/' + project.uid"
            >
              <ProjectBlocItem
                :project="project"
              />
            </router-link>
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
      </div>

      <EmptyTasksListPics v-if="isEmpty" />
    </div>
    <div
      v-if="displayModal"
      class="flex flex-col justify-center items-center "
    >
      <img
        class="mx-auto mt-10"
        width="280"
        height="314"
        src="@/assets/images/emptyproject.png"
        alt="Empty task image"
      >
      <div class="w-[600px]">
        <p class="font-bold p-3">
          Организуйте проекты по определенному направлению, теме или сфере в вашем бизнесе
        </p>
        <ul class="list-decimal pl-[30px]">
          <li class="p-3 text-sm">
            Мои проекты - это ваши проекты. Вы можете установить цвет для проекта и добавить в него коллег, чтобы совместно работать над задачами
          </li>
          <li class="p-3 text-sm">
            Общие проекты - проекты, к которым вам дали доступ
          </li>
          <li class="p-3 text-sm">
            Участники проекта видят все задачи в нем
          </li>
        </ul>
      </div>
      <button
        class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[20px]"
        @click="okToModal"
      >
        Понятно
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'
import NavBar from '@/components/Navbar/NavBar.vue'

import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import InputValue from '@/components/InputValue'
import { uuidv4 } from '@/helpers/functions'

export default {
  components: {
    InputValue,
    Icon,
    ProjectBlocItem,
    ListBlocAdd,
    ProjectModalBoxProjectsLimit,
    EmptyTasksListPics,
    NavBar
  },
  data () {
    return {
      showProjectsLimit: false,
      showAddProject: false,
      gridView,
      listView
    }
  },
  computed: {
    items () {
      return this.$store.getters.sortedNavigator.new_private_projects
    },
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isEmpty () {
      return !this.items[0].items.length && !this.items[1].items.length
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('project') && this.$store.state.onboarding.showModals
    }
  },
  created () {
    setLocalStorageItem('isGridView', true)
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    clickAddProject () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && user.days_left <= 0) {
        this.showProjectsLimit = true
        return
      }
      this.showAddProject = true
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
        const user = this.$store.state.user.user
        const project = {
          uid: uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
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
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'project')
    }
  }
}
</script>

<style scoped></style>
