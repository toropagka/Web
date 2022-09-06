<template>
  <NavBar
    id="NavBarBoards"
    title="Доски"
    route="/board"
    :breadcrumbs="breadcrumbs"
  >
    <NavBarSearch
      @change="onSearch"
    />
    <NavBarButtonsBoard
      :board-uid="boardUid"
      @popNavBar="popNavBar"
    />
  </NavBar>
</template>

<script>
import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import NavBar from '@/components/Navbar/NavBar.vue'

import * as BOARD from '@/store/actions/boards'

export default {
  components: {
    NavBarButtonsBoard,
    NavBarSearch,
    NavBar
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
    breadcrumbs () {
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
