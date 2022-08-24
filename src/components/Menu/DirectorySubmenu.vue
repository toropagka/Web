<template>
  <div
    style="overflow-x:hidden; scrollbar-width: none;"
    class="w-[292px] fixed top-0 pt-[15px] z-30 h-screen transition-position bg-[#f4f5f7] font-SfProDisplayNormal text-sm"
  >
    <AsideMenuSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <div class="my-[10px]">
        <template v-for="(menuGroup, index) in menu">
          <div
            v-if="typeof menuGroup === 'string'"
            :key="`a-${index}`"
            class="my-2"
          >
            <hr
              :key="`a-${index}`"
              class="text-xs mx-3 custom-border-divider"
              :class="[ asideMenuLabelStyle ]"
            >
          </div>
          <aside-menu-list
            v-else
            :key="`b-${index}`"
            :menu="menuGroup"
            :assigments="assigments"
            @menu-click="menuClick"
            @assigments-click="assigmentsClick"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AsideMenuList from '@/components/AsideMenuList.vue'
import AsideMenuSkeleton from '@/components/AsideMenuSkeleton.vue'
import 'v-calendar/dist/style.css'
import { UID_TO_ACTION } from '@/store/helpers/functions'

import warn from '@/icons/warn.js'
import { mdiMenu } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    AsideMenuSkeleton,
    AsideMenuList
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      newDayTimerID: 0,
      dateToday: '',
      mdiMenu,
      currentDay: null,
      visitedDay: null,
      userParentId: null,
      warn,
      showFreeModal: false,
      modalOneActive: false,
      lastVisitedDate: this.navStack && this.navStack.length && this.navStack[this.navStack.length - 1] && this.navStack[this.navStack.length - 1].uid && this.navStack[this.navStack.length - 1].uid === '901841d9-0016-491d-ad66-8ee42d2b496b' && this.navStack[this.navStack.length - 1].param ? new Date(this.navStack[this.navStack.length - 1].param) : new Date(),
      currentSettingsTab: 'account'
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    isFullScreen () {
      return this.$store.state.isFullScreen
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isDark () {
      return this.$store.state.darkMode
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    datePickerBG () {
      return this.isDark ? 'rgb(31 41 55)' : '#f4f5f7'
    },
    attrs () {
      return this.$store.getters.attrsCalendar
    },
    user () {
      return this.$store.state.user.user
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    getNavigatorLanguage () {
      return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'
    },
    favoriteBoards () {
      const arr = []
      const boards = this.$store.state.boards.boards
      Object.keys(boards).forEach(key => {
        if (boards[key].favorite === 1) {
          arr.push(boards[key])
        }
      })
      return arr.sort((board1, board2) => { return board1.name.localeCompare(board2.name) })
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
    assigments () {
      return { delegate_iam: this.storeNavigator.delegate_iam, delegate_to_me: this.storeNavigator.delegate_to_me }
    }
  },
  mounted () {
    let currDate = new Date()
    currDate.setHours(0, 0, 0, 0)
    this.newDayTimerID = setInterval(() => {
      const newDate = new Date()
      newDate.setHours(0, 0, 0, 0)
      if (currDate.getTime() !== newDate.getTime()) {
        currDate = newDate
        this.onNewDay()
      }
    }, 1000)
  },
  beforeUnmount () {
    clearInterval(this.newDayTimerID)
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    },
    asideLgClose () {
      this.$store.dispatch('asideLgToggle', false)
    },
    // TODO: clean up messy logic
    menuClick (event, item) {
      console.log('directory', item)

      // Если уже находимся на этой вкладке игнорировать дальнейший код
      if (this.checkOnWhichTab(item)) {
        return
      }
      this.userParentId = null
      this.visitedDay = ''
      if (item.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
        this.dateToday = new Date()
      }

      if (item.path === 'new_private_boards' || item.path === 'new_private_projects') {
        this.$store.state.navigator.submenu.status = true
        this.$store.state.navigator.submenu.path = item.path
        return
      } else {
        this.$store.state.navigator.submenu.status = false
      }

      console.log(item)
      // скрывать навбар при онбординге
      // if (this.$store.state.onboarding.visitedModals) {
      //   this.$store.state.onboarding.hideNavBar = false
      //   if (!this.$store.state.onboarding.visitedModals?.includes(this.$store.state.onboarding.hintUid[item.uid])) {
      //     console.log('hide')
      //     this.$store.state.onboarding.hideNavBar = true
      //   }
      // }
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }

      if (['account', 'tarif', 'option', 'karma', 'support'].includes(item.type)) {
        this.$store.state.navigator.currentSettingsTab = item.type
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: item.type
        }
        localStorage.setItem('currentSettingsTab', item.type)
        this.$store.commit('updateStackWithInitValue', navElem)
        return
      }

      // do it now
      if (item.uid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
        window.ym(89796698, 'reachGoal', 'doitnow')
        if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
          this.showFreeModal = true
          return
        }
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: 'doitnow'
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'doitnow' })
        return
      }

      // other
      if (item.uid === '757be87d-c269-40e0-b224-6b2bb0e4f97d') {
        const navElem = {
          name: item.label,
          key: 'greedSource',
          value: { uid: item.uid, param: null },
          greedPath: 'other'
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'other' })
        // отображаем навбар в прочее
        this.$store.state.onboarding.hideNavBar = false
        return
      }

      // colors & tags
      if (item.uid === 'ed8039ae-f3de-4369-8f32-829d401056e9' || item.uid === '00a5b3de-9474-404d-b3ba-83f488ac6d30') {
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: item.path })
        const navElem = {
          name: item.label,
          key: 'greedSource',
          greedPath: item.path,
          value: this.storeNavigator[item.path]?.items
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path]?.items })
        return
      }

      // Tasks list source
      if (UID_TO_ACTION[item.uid] && item.type === 'uid') {
        this.$store.dispatch(UID_TO_ACTION[item.uid])
        const navElem = {
          name: item.label,
          key: 'taskListSource',
          value: { uid: item.uid, param: new Date() },
          typeVal: new Date(),
          type: 'date'
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        if (item.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') { this.lastVisitedDate = new Date() } // desktop check
        this.$store.commit('basic', { key: 'taskListSource', value: { uid: item.uid, param: null } })
        this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      // Grid source (projects, employees, colors, tags)
      } else {
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: item.path })
        if (item.path === 'new_private_projects' || item.path === 'new_emps' || item.path === 'new_delegate' || item.path === 'new_private_boards') {
          const navElem = {
            name: item.label,
            key: 'greedSource',
            greedPath: item.path,
            value: this.storeNavigator[item.path]
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path] })
        } else {
          console.log(item.uid)
          const navElem = {
            name: item.label,
            key: 'greedSource',
            greedPath: item.path,
            value: this.storeNavigator[item.path]?.items
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path]?.items })
        }
      }
    },
    onDayClick (day) {
      if (this.checkOnWhichDay(day)) {
        return
      }
      this.userParentId = null
      this.resetLastTab()
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.dispatch(TASK.TASKS_REQUEST, new Date(day.date))
      const navElem = {
        name: this.dateToLabelFormat(day.date),
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) },
        typeVal: new Date(day.date),
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.lastVisitedDate = new Date() // desktop check
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    },
    goToBoard (board) {
      if (this.checkOnWhichTab(board)) {
        return
      }
      this.userParentId = null
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }

      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      const path = 'new_private_boards'
      const el = {
        greedPath: path,
        key: 'greedSource',
        name: 'Доски',
        value: this.storeNavigator[path]
      }
      this.$store.commit('updateStackWithInitValue', el)

      this.$store.dispatch(CARD.BOARD_CARDS_REQUEST, board.uid)
      this.$store.commit('basic', {
        key: 'cardSource',
        value: { uid: board.global_property_uid, param: board.uid }
      })

      const navElem = {
        name: board.name,
        key: 'greedSource',
        uid: board.uid,
        global_property_uid: board.global_property_uid,
        greedPath: 'boards_children',
        value: board.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: board.children })
      this.$store.commit('basic', {
        key: 'greedPath',
        value: 'boards_children'
      })
    },
    goToProject (project) {
      if (this.checkOnWhichTab(project)) {
        return
      }
      this.userParentId = null
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }

      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      const path = 'new_private_projects'
      const el = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: path,
        value: this.storeNavigator[path]
      }
      this.$store.commit('updateStackWithInitValue', el)

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
    checkOnWhichTab (item) {
      const lastNavStack = this.navStack[this.navStack.length - 1]
      if (lastNavStack?.value?.uid === item.uid ||
        lastNavStack?.uid === item.uid ||
        lastNavStack?.name === item.label ||
        (lastNavStack.name && item.name && lastNavStack?.name === item.name)) {
        return true
      }
    },
    checkOnWhichDay (day) {
      this.currentDay = day.id
      if (this.visitedDay === this.currentDay) {
        return true
      }
      this.visitedDay = this.currentDay
    },
    resetLastTab () {
      this.lastSelectedItem = null
    },
    onNewDay () {
      this.$store.commit('updateCalendarToday')
      //
    },
    assigmentsClick (user) {
      if (this.$store.state.navbar.lastSelectedAsideTab === user.uid && this.userParentId === user.parentID) {
        return
      }
      console.log(user.parentID)
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }

      const action = UID_TO_ACTION[user.parentID]
      if (!action) {
        console.error('UID_TO_ACTION in undefined', user.parentID)
        return
      }
      this.$store.dispatch(action, user.email)
      const navElem = {
        name: user.name,
        key: 'taskListSource',
        value: { uid: user.parentID, param: user.email }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: user.parentID, param: user.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
      this.$store.state.navbar.lastSelectedAsideTab = user.uid
      this.userParentId = user.parentID
    }
  }
}
</script>
