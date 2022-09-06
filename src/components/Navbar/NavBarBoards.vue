<template>
  <nav
    id="NavBarBoards"
    class="flex items-center h-[56px]"
  >
    <NavBarButtonToggleMenu class="flex-1 items-stretch" />
    <div class="flex gap-[12px] items-center w-full overflow-hidden">
      <NavBarBreadcrumb
        :breadcrumb="{ name: 'Доски', to: '/board', showNext: true }"
        class="flex-none"
      />
      <NavBarBreadcrumb
        v-if="showDots"
        :breadcrumb="{ name: '...', showNext: true }"
        class="flex-none"
      />
      <NavBarBreadcrumb
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        :breadcrumb="breadcrumb"
        class="flex-initial"
      />
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
import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import NavBarButtonToggleMenu from '@/components/Navbar/NavBarButtonToggleMenu.vue'
import NavBarBreadcrumb from '@/components/Navbar/NavBarBreadcrumb.vue'

import * as BOARD from '@/store/actions/boards'

export default {
  components: {
    NavBarButtonsBoard,
    NavBarSearch,
    NavBarButtonToggleMenu,
    NavBarBreadcrumb
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    }
  },
  computed: {
    boards () {
      return this.$store.state.boards.boards
    },
    breadcrumbsAll () {
      let board = this.boards[this.boardUid]
      if (!board) return [{ name: '???', selected: true }]

      const arrResult = [
        { name: board.name, selected: true } // на самого себя нажать нельзя по этому не добавляем to
      ]

      board = this.boards[board.uid_parent]
      while (board) {
        arrResult.unshift({ name: board.name, to: `/board/${board.uid}`, showNext: true })
        board = this.boards[board.uid_parent]
      }

      return arrResult
    },
    showDots () {
      return this.breadcrumbsAll.length > 2
    },
    breadcrumbs () {
      return this.breadcrumbsAll.slice(-2)
    }
  },
  methods: {
    popNavBar () {
      const prevIndex = this.breadcrumbs.length - 2
      const to = prevIndex >= 0 ? this.breadcrumbs[prevIndex].to : null
      this.$router.push(to || '/board')
    },
    onSearch (text) {
      this.$store.commit(BOARD.SHOW_SEARCH_CARDS, text)
    }
  }
}
</script>
