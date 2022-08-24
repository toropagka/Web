<template>
  <div class="px-[16px] pt-[15px]">
    <AsideMenuListSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <AsideMenuListItem
        :selected="isReglamentsSelected"
        title="Регламенты"
        @click="gotoReglaments"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59.346 18.2667L45.746 4.66667C45.346 4.26667 44.746 4 44.146 4C43.546 4 42.946 4.26667 42.546 4.66667L35.546 11.6667C34.6793 12.5333 34.6793 14 35.546 14.8667L35.6126 14.9333L18.0793 23.6667C17.6126 23.9333 17.2126 24.3333 17.0126 24.8667L4.21263 56.8667C4.21263 56.9333 4.14597 57 4.14597 57.0667C4.0793 57.2 4.01263 57.3333 4.01263 57.4667C3.94597 58.0667 4.14597 58.6667 4.54597 59.1333C4.94597 59.7333 5.61263 60 6.2793 60C6.41263 60 6.54597 60 6.6793 59.9333C6.74597 59.9333 6.81263 59.9333 6.8793 59.8667C6.94597 59.8667 7.01263 59.8 7.0793 59.8L39.0793 47C39.6126 46.8 40.0126 46.4 40.2793 45.9333L49.0126 28.4L49.0793 28.4667C49.4793 28.8667 50.0793 29.1333 50.6793 29.1333C51.2793 29.1333 51.8793 28.8667 52.2793 28.4667L59.346 21.4667C60.2126 20.6 60.2126 19.1333 59.346 18.2667ZM27.746 35.3333C27.746 34.8 28.146 34.4 28.6793 34.4C29.2126 34.4 29.6126 34.8 29.6126 35.3333C29.6126 35.8667 29.2126 36.2667 28.6793 36.2667C28.146 36.2667 27.746 35.8 27.746 35.3333ZM15.6793 51.5333L26.746 40.4667C27.346 40.6667 28.0126 40.8 28.6793 40.8C31.6793 40.8 34.146 38.3333 34.146 35.3333C34.146 32.3333 31.6793 29.8667 28.6793 29.8667C25.6793 29.8667 23.2126 32.3333 23.2126 35.3333C23.2126 36 23.346 36.6667 23.546 37.2667L12.4793 48.3333L20.8793 27.3333L38.946 18.2667L45.6793 25L36.6793 43.1333L15.6793 51.5333ZM40.346 13.2667L44.146 9.46667L54.546 19.8667L50.746 23.6667L40.346 13.2667Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
    </div>
  </div>
  <div v-if="status == 'success'">
    <template
      v-for="(menuGroup, index) in menu"
      :key="`b-${index}`"
    >
      <aside-menu-list
        :menu="menuGroup"
        @menu-click="menuClick"
      />
    </template>
  </div>
</template>

<script>
import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'
import AsideMenuListSkeleton from '@/components/AsideMenu/AsideMenuListSkeleton.vue'
import AsideMenuListItem from '@/components/AsideMenu/AsideMenuListItem.vue'
import 'v-calendar/dist/style.css'

import warn from '@/icons/warn.js'
import { mdiMenu } from '@mdi/js'

export default {
  components: {
    AsideMenuListSkeleton,
    AsideMenuList,
    AsideMenuListItem
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
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    },
    user () {
      return this.$store.state.user.user
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    isReglamentsSelected () {
      console.log(this.lastNavStack)
      return this.lastNavStack?.greedPath === 'reglaments' ||
      this.lastNavStack?.global_property_uid === '92413f6c-2ef3-476e-9429-e76d7818685d'
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
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    },
    gotoReglaments () {
      localStorage.setItem('lastTab', 'directory')
      // закрываем сабменю
      this.closeSubMenu()
      // если вкладка не поменялась - ничего не делаем
      if (this.isReglamentsSelected) return
      // закрываем свойства
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      // открываем вид
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglaments' })
      const navElem = {
        name: 'Регламенты',
        key: 'greedSource',
        greedPath: 'reglaments',
        value: this.storeNavigator.reglaments?.items
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: navElem.value })
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      return day + ' ' + month + ', ' + weekday
    },
    // TODO: clean up messy logic
    menuClick (event, item) {
      localStorage.setItem('lastTab', 'directory')
      this.closeSubMenu()

      console.log('directory', item)

      // Если уже находимся на этой вкладке игнорировать дальнейший код
      if (this.checkOnWhichTab(item)) {
        return
      }

      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
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
    },
    checkOnWhichTab (item) {
      if (this.lastNavStack?.value?.uid === item.uid ||
        this.lastNavStack?.uid === item.uid ||
        this.lastNavStack?.name === item.label ||
        (this.lastNavStack.name && item.name && this.lastNavStack?.name === item.name)) {
        return true
      }
    }
  }
}
</script>
