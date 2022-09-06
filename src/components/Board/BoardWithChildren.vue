<template>
  <div class="h-screen overflow-auto">
    <NavBarBoards
      class="pt-[8px]"
      :board-uid="boardUid"
    />
    <div
      class="w-full h-[calc(100%-56px)] flex flex-col"
    >
      <BoardModalBoxBoardsLimit
        v-if="showBoardsLimit"
        @cancel="showBoardsLimit = false"
        @ok="showBoardsLimit = false"
      />
      <div
        v-if="subBoardsCount > 0"
        class="grid gap-2 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      >
        <template
          v-for="(board) in subBoards"
          :key="board.uid"
        >
          <BoardBlocItem
            :board="board"
            @click.stop="goToChildBoard(board)"
          />
        </template>
      </div>
      <div class="mt-5 h-full min-h-0">
        <Board
          :store-cards="storeCards"
          :board="currentBoard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NavBarBoards from '@/components/Navbar/NavBarBoards.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import Board from '@/components/Board.vue'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    NavBarBoards,
    Board
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    subBoards () {
      return this.currentBoard?.children
    },
    subBoardsCount () {
      return this.subBoards?.length ?? 0
    },
    storeCards () {
      return this.$store.state.cards.cards
    },
    boardUid () {
      return this.$route.params.board_id
    },
    currentBoard () {
      return this.$store.state.boards.boards[this.boardUid]
    }
  },
  watch: {
    boardUid (newUid) {
      if (newUid) {
        this.loadBoard()
      }
    }
  },
  mounted () {
    this.loadBoard()
    this.$store.state.navigator.lastTab = 'new_private_boards'
  },
  methods: {
    canAddChild () {
      const user = this.$store.state.user.user
      return this.currentBoard?.email_creator === user.current_user_email
    },
    loadBoard () {
      if (!this.currentBoard || !Object.keys(this.$store.state.boards.boards).includes(this.$route.params.board_id)) {
        this.$router.push('/board')
        return
      }

      const navElemRoot = {
        name: 'Доски',
        key: 'greedSource',
        greedPath: 'new_private_boards',
        value: this.$store.state.navigator.navigator.new_private_boards
      }
      this.$store.commit('updateStackWithInitValue', navElemRoot)

      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'new_private_boards' })
      this.$store.commit('basic', { key: 'greedSource', value: this.$store.state.navigator.navigator.new_private_boards })

      this.$store.dispatch(CARD.BOARD_CARDS_REQUEST, this.currentBoard.uid)
      this.$store.commit('basic', {
        key: 'cardSource',
        value: { uid: this.currentBoard.global_property_uid, param: this.currentBoard.uid }
      })

      const navElem = {
        name: this.currentBoard.name,
        key: 'greedSource',
        uid: this.currentBoard.uid,
        global_property_uid: this.currentBoard.global_property_uid,
        greedPath: 'boards_children',
        value: this.currentBoard.children
      }

      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.currentBoard.children })
      this.$store.commit('basic', {
        key: 'greedPath',
        value: 'boards_children'
      })
    },
    goToChildBoard (board) {
      this.$router.push(`/board/${board.uid}`)
    }
  }
}
</script>

<style scoped></style>
