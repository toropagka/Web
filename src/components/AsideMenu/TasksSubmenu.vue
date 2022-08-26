<template>
  <div class="px-[16px] pt-[15px]">
    <AsideMenuSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <TasksSubmenuCalendar
        class="pl-[6px] mb-[10px]"
        @dayclick="onDayClick"
      />
      <AsideMenuListItem
        :selected="isTodaySelected"
        title="Сегодня"
        @click="gotoToday"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.69793 4.46611C8.69793 3.91238 9.14681 3.4635 9.70054 3.4635C10.2543 3.4635 10.7031 3.91238 10.7031 4.46611V5.18226H19.2969V4.46611C19.2969 3.91238 19.7458 3.4635 20.2995 3.4635C20.8533 3.4635 21.3021 3.91238 21.3021 4.46611V5.18226H23.0209C24.2865 5.18226 25.3126 6.20827 25.3126 7.47393V22.3698C25.3126 23.6355 24.2865 24.6615 23.0209 24.6615H6.97917C5.71352 24.6615 4.6875 23.6355 4.6875 22.3698V7.47393C4.6875 6.20827 5.71352 5.18226 6.97917 5.18226H8.69793V4.46611ZM19.2969 6.75778V7.90362C19.2969 8.45734 19.7458 8.90622 20.2995 8.90622C20.8533 8.90622 21.3021 8.45734 21.3021 7.90362V6.75778H23.0209C23.4164 6.75778 23.737 7.07841 23.737 7.47393V22.3698C23.737 22.7653 23.4164 23.086 23.0209 23.086H6.97917C6.58366 23.086 6.26303 22.7653 6.26303 22.3698V7.47393C6.26303 7.07841 6.58366 6.75778 6.97917 6.75778H8.69793V7.90362C8.69793 8.45734 9.14681 8.90622 9.70054 8.90622C10.2543 8.90622 10.7031 8.45734 10.7031 7.90362V6.75778H19.2969ZM9.62005 10.8333C8.9095 10.8333 8.3335 11.4224 8.3335 12.1491C8.3335 12.8758 8.9095 13.4649 9.62005 13.4649C10.3306 13.4649 10.9066 12.8758 10.9066 12.1491C10.9066 11.4224 10.3306 10.8333 9.62005 10.8333ZM15.4914 12.1491C15.4914 11.4224 16.0674 10.8333 16.7779 10.8333C17.4885 10.8333 18.0645 11.4224 18.0645 12.1491C18.0645 12.8758 17.4885 13.4649 16.7779 13.4649C16.0674 13.4649 15.4914 12.8758 15.4914 12.1491ZM15.4914 15.8333C15.4914 15.1066 16.0674 14.5175 16.7779 14.5175C17.4885 14.5175 18.0645 15.1066 18.0645 15.8333C18.0645 16.56 17.4885 17.1491 16.7779 17.1491C16.0674 17.1491 15.4914 16.56 15.4914 15.8333ZM15.4914 19.5175C15.4914 18.7908 16.0674 18.2017 16.7779 18.2017C17.4885 18.2017 18.0645 18.7908 18.0645 19.5175C18.0645 20.2442 17.4885 20.8333 16.7779 20.8333C16.0674 20.8333 15.4914 20.2442 15.4914 19.5175ZM19.0937 12.1491C19.0937 11.4224 19.6697 10.8333 20.3803 10.8333C21.0908 10.8333 21.6668 11.4224 21.6668 12.1491C21.6668 12.8758 21.0908 13.4649 20.3803 13.4649C19.6697 13.4649 19.0937 12.8758 19.0937 12.1491ZM19.0937 15.8333C19.0937 15.1066 19.6697 14.5175 20.3803 14.5175C21.0908 14.5175 21.6668 15.1066 21.6668 15.8333C21.6668 16.56 21.0908 17.1491 20.3803 17.1491C19.6697 17.1491 19.0937 16.56 19.0937 15.8333ZM19.0937 19.5175C19.0937 18.7908 19.6697 18.2017 20.3803 18.2017C21.0908 18.2017 21.6668 18.7908 21.6668 19.5175C21.6668 20.2442 21.0908 20.8333 20.3803 20.8333C19.6697 20.8333 19.0937 20.2442 19.0937 19.5175ZM8.3335 15.8333C8.3335 15.1066 8.9095 14.5175 9.62005 14.5175C10.3306 14.5175 10.9066 15.1066 10.9066 15.8333C10.9066 16.56 10.3306 17.1491 9.62005 17.1491C8.9095 17.1491 8.3335 16.56 8.3335 15.8333ZM8.3335 19.5175C8.3335 18.7908 8.9095 18.2017 9.62005 18.2017C10.3306 18.2017 10.9066 18.7908 10.9066 19.5175C10.9066 20.2442 10.3306 20.8333 9.62005 20.8333C8.9095 20.8333 8.3335 20.2442 8.3335 19.5175ZM11.9358 12.1491C11.9358 11.4224 12.5119 10.8333 13.2224 10.8333C13.9329 10.8333 14.5089 11.4224 14.5089 12.1491C14.5089 12.8758 13.9329 13.4649 13.2224 13.4649C12.5119 13.4649 11.9358 12.8758 11.9358 12.1491ZM11.9358 15.8333C11.9358 15.1066 12.5119 14.5175 13.2224 14.5175C13.9329 14.5175 14.5089 15.1066 14.5089 15.8333C14.5089 16.56 13.9329 17.1491 13.2224 17.1491C12.5119 17.1491 11.9358 16.56 11.9358 15.8333ZM11.9358 19.5175C11.9358 18.7908 12.5119 18.2017 13.2224 18.2017C13.9329 18.2017 14.5089 18.7908 14.5089 19.5175C14.5089 20.2442 13.9329 20.8333 13.2224 20.8333C12.5119 20.8333 11.9358 20.2442 11.9358 19.5175Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
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
import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'
import AsideMenuListItem from '@/components/AsideMenu/AsideMenuListItem.vue'
import TasksSubmenuCalendar from '@/components/AsideMenu/TasksSubmenuCalendar.vue'
import { UID_TO_ACTION } from '@/store/helpers/functions'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    AsideMenuSkeleton,
    AsideMenuList,
    TasksSubmenuCalendar,
    AsideMenuListItem
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  emits: ['closeSubMenu'],
  data () {
    return {
      currentDay: null,
      visitedDay: null,
      userParentId: null
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    user () {
      return this.$store.state.user.user
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    assigments () {
      return { delegate_iam: this.storeNavigator.delegate_iam, delegate_to_me: this.storeNavigator.delegate_to_me }
    },
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    },
    isTodaySelected () {
      return this.isDateSelected(new Date())
    }
  },
  methods: {
    pushToRouter () {
      localStorage.setItem('lastTab', 'tasks')
      this.$router.push('/tasks')
    },
    isDateSelected (date) {
      if (
        this.lastNavStack?.value?.uid === '901841d9-0016-491d-ad66-8ee42d2b496b' &&
        this.lastNavStack?.value?.param
      ) {
        const compareDate = new Date(date)
        const selectedDate = new Date(this.lastNavStack?.value?.param)
        return compareDate.getDate() === selectedDate.getDate() &&
               compareDate.getMonth() === selectedDate.getMonth() &&
               compareDate.getFullYear() === selectedDate.getFullYear()
      }
      return false
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    },
    // TODO: clean up messy logic
    menuClick (event, item) {
      // Если уже находимся на этой вкладке игнорировать дальнейший код
      this.pushToRouter()
      if (this.checkOnWhichTab(item)) {
        return
      }
      this.$emit('closeSubMenu')
      this.userParentId = null
      this.visitedDay = ''
      if (item.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
        this.$store.commit('setCalendarLastPicked', new Date().date)
      }

      if (item.path === 'new_private_boards' || item.path === 'new_private_projects') {
        this.$store.state.navigator.submenu.status = true
        this.$store.state.navigator.submenu.path = item.path
        return
      } else {
        this.$store.state.navigator.submenu.status = false
      }

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
    gotoToDate (date) {
      this.pushToRouter()
      this.$emit('closeSubMenu')
      // если день уже выбран - ничего не делаем
      if (this.isDateSelected(date)) return
      //
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      //
      this.userParentId = null
      this.resetLastTab()
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.dispatch(TASK.TASKS_REQUEST, new Date(date))
      const navElem = {
        name: this.dateToLabelFormat(date),
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(date) },
        typeVal: new Date(date),
        type: 'date'
      }
      this.$store.commit('setCalendarLastPicked', date)
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(date) } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    },
    gotoToday () {
      this.gotoToDate(new Date())
    },
    onDayClick (day) {
      this.gotoToDate(day.date)
    },
    checkOnWhichTab (item) {
      const lastNavStack = this.navStack[this.navStack.length - 1]
      if (lastNavStack?.value?.uid === item.uid ||
        lastNavStack?.uid === item.uid ||
        lastNavStack?.name === item.label ||
        (lastNavStack?.name && item.name && lastNavStack?.name === item.name)) {
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

      this.$emit('closeSubMenu')
    }
  }
}
</script>

<style scoped>
</style>
