<template>
  <div
    v-show="!isFullScreen"
    id="aside"
    style="overflow-x:hidden"
  >
    <AsideMenuSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <div class="mt-[20px]">
        <DatePicker
          v-if="lastTab === 'tasks'"
          id="step4"
          ref="calendarclass"
          v-model="dateToday"
          dot="true"
          class="border-none pl-[22px] pr-[16px] calendar-nav-custom"
          :style="{ backgroundColor: datePickerBG }"
          show-weeknumbers="left"
          days="-1"
          color="#CCC"
          week-from-end="6"
          is-expanded
          :locale="getNavigatorLanguage"
          :masks="{ weekdays: 'WWW' }"
          :attributes="attrs"
          :is-dark="isDark"
          mode="single"
          is-inline
          in-next-month="true"
          in-month="true"
          in-prev-month="true"
          @dayclick="onDayClick"
        />
      </div>
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
import { DatePicker } from 'v-calendar'
import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'
import 'v-calendar/dist/style.css'
import { UID_TO_ACTION } from '@/store/helpers/functions'

import warn from '@/icons/warn.js'
import { mdiMenu } from '@mdi/js'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    DatePicker,
    AsideMenuSkeleton,
    AsideMenuList
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
    assigments () {
      return { delegate_iam: this.storeNavigator.delegate_iam, delegate_to_me: this.storeNavigator.delegate_to_me }
    }
  },
  mounted () {
    let currDate = new Date()
    currDate.setHours(0, 0, 0, 0)
    this.setLastPickedDate()
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
    setLastPickedDate () {
      if (this.navStack[0]?.value?.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
        this.$store.commit('updateCalendarLastPicked', this.navStack[0].value.param)
      }
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
      if (this.checkOnWhichTab(item)) {
        return
      }
      localStorage.setItem('lastTab', 'tasks')
      this.$emit('closeSubMenu')
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
      localStorage.setItem('lastTab', 'tasks')
      this.$emit('closeSubMenu')
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
      this.$store.commit('updateCalendarLastPicked', day.date)
      this.$store.commit('updateStackWithInitValue', navElem)
      this.lastVisitedDate = new Date() // desktop check
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date(day.date) } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
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

<style>
.vc-container.calendar-nav-custom
{
  @apply font-roboto;
}

.calendar-nav-custom .vc-weeknumber-content {
  @apply bg-white rounded-[6px] text-[#8b64bd] not-italic text-[11px] mt-0 mr-[2px] h-[24px] w-[24px];
}

.calendar-nav-custom .vc-weeks {
  @apply p-0;
}

.calendar-nav-custom .vc-arrow {
  @apply text-[#424242] w-[32px] h-[32px];
}

.calendar-nav-custom .vc-title {
  @apply text-[#424242] capitalize text-[15px] font-bold;
}

.calendar-nav-custom .vc-weekday {
  @apply text-[#424242] capitalize text-[12px] h-[34px] pt-0 pb-0 flex items-center justify-center font-bold;
}
.calendar-nav-custom .vc-weekday:nth-child(7), .vc-weekday:nth-child(8)
{
  @apply text-[#e23300];
}

.calendar-nav-custom .vc-header
{
  @apply mb-[2px] h-[32px] p-0;
}

.calendar-nav-custom .vc-arrows-container
{
  @apply h-[32px] p-0;
}

.calendar-nav-custom .vc-day
{
  @apply min-h-[30px] h-[30px] w-[30px];
}

.calendar-nav-custom .vc-day-content:focus
{
  @apply bg-[#ff9123]/70 !important;
}

.calendar-nav-custom .vc-highlight,
.calendar-nav-custom .vc-highlight:focus
{
  @apply bg-[#ff9123]/50;
}

.calendar-nav-custom .vc-day-content,
.calendar-nav-custom .vc-highlight
{
  @apply rounded-[8px] w-[30px] h-[30px] border-[#ff9123]/40 text-[#424242] text-[12px] font-medium !important;
}

.calendar-nav-custom .is-not-in-month .vc-day-content,
.calendar-nav-custom .is-not-in-month .vc-highlights,
.calendar-nav-custom .is-not-in-month .vc-day-layer,
.calendar-nav-custom .is-not-in-month .vc-highlight
{
  @apply opacity-100 pointer-events-auto text-black/50 !important;
}

.calendar-nav-custom .vc-day.weekday-7:not(.is-not-in-month) .vc-day-content,
.calendar-nav-custom .vc-day.weekday-1:not(.is-not-in-month) .vc-day-content
{
  @apply text-red-500 !important;
}

.calendar-nav-custom .dots-back
{
  background-color: #444444!important;
  height: 3px !important;
  width: 3px !important;
  position: relative !important;
  top: 11px !important;
  border-radius: 9999px !important;
}
</style>
