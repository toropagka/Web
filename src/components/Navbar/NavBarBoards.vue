<template>
  <nav
    id="NavBarBoards"
    class="flex items-center h-[56px]"
  >
    <NavBarButtonToggleMenu class="flex-1 items-stretch" />
    <div class="flex flex-wrap w-full">
      <nav-bar-item
        v-for="(navItem, index) in navStack"
        :key="index"
        class="px-1 group max-w-[150px]"
        :non-clickable-element="nonClickableElement(index)"
      >
        <span
          v-if="navItem && navItem.name"
          class="font-['Roboto'] font-[700] text-[#4C4C4D] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[16px] truncate"
          :class="index === 0 ? 'text-[#4C4C4D] font-[700]' : index+1 === navStack.length ? 'text-[#4C4C4D] font-[700]' : 'text-[#4C4C4D] font-[700]'"
          @click.stop="clickOnGridCard(navItem, index), closeProperties()"
        >
          {{ new Date(navItem.value?.param).getDate() === new Date().getDate() &&
            new Date(navItem.value?.param).getMonth() === new Date().getMonth() &&
            new Date(navItem.value?.param).getFullYear() === new Date().getFullYear() &&
            navItem.value.uid === '901841d9-0016-491d-ad66-8ee42d2b496b'
            ? 'Сегодня'
            : navItem.name
          }}
        </span>
        <div>
          <icon
            v-if="index !== navStack.length - 1"
            class="ml-2.5 mr-0.5 text-gray-500"
            :path="arrowForward.path"
            :width="6"
            :height="12"
            :box="arrowForward.viewBox"
          />
        </div>
      </nav-bar-item>
    </div>
    <div class="flex-none flex gap-[10px] items-center px-[12px]">
      <NavBarSearch
        @change="onSearch"
      />
      <NavBarButtonsBoard
        :board-uid="boardUid"
        @popNavBar="popNavBar"
      />
    </div>
  </nav>
</template>

<script>
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'
import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import NavBarButtonToggleMenu from '@/components/Navbar/NavBarButtonToggleMenu.vue'

import arrowForward from '@/icons/arrow-forward.js'
import arrowDown from '@/icons/arrow-down.js'

import * as BOARD from '@/store/actions/boards'

export default {
  components: {
    NavBarItem,
    Icon,
    NavBarButtonsBoard,
    NavBarSearch,
    NavBarButtonToggleMenu
  },
  data () {
    return {
      arrowForward,
      arrowDown
    }
  },
  computed: {
    navStack () {
      return this.$store.state.navbar.navStack
    },
    boardUid () {
      return this.$route.params.board_id
    }
  },
  methods: {
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    nonClickableElement (index) {
      return index === this.navStack.length - 1
    },
    clickOnGridCard (item, index) {
      if (index === this.navStack.length - 1 || index === 0) {
        return
      }
      this.$store.dispatch('gotoNavStackItem', index)
    },
    popNavBar () {
      this.$store.dispatch('popNavStack')
    },
    onSearch (text) {
      this.$store.commit(BOARD.SHOW_SEARCH_CARDS, text)
    }
  }
}
</script>
