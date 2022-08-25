<template>
  <NavBar />
  <div
    class="w-full h-full flex flex-col"
    :class="{ 'pt-[30px]': !canAddChild, 'pt-[45px]' : canAddChild}"
  >
    <BoardModalBoxBoardsLimit
      v-if="showBoardsLimit"
      @cancel="showBoardsLimit = false"
      @ok="showBoardsLimit = false"
    />
    <div class="grid gap-2 mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <template
        v-for="(board, pindex) in boards"
        :key="pindex"
      >
        <BoardBlocItem
          :board="board"
          @click.stop="gotoChildren(board)"
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
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import Board from '@/components/Board.vue'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    NavBar,
    Board
  },
  props: {
    boards: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    currentBoard () {
      const boards = this.$store.state.boards.boards
      const navStack = this.$store.state.navbar.navStack
      const currBoardUid = navStack[navStack.length - 1].uid
      const board = boards[currBoardUid]
      return board
    },
    storeCards () {
      return this.$store.state.cards.cards
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.board?.email_creator === user.current_user_email
    },
    gotoChildren (board) {
      this.$store.dispatch(CARD.BOARD_CARDS_REQUEST, board.uid)
      this.$store.commit('basic', {
        key: 'cardSource',
        value: { uid: board.global_property_uid, param: board.uid }
      })
      // store.commit(TASK.CLEAN_UP_LOADED_TASKS)

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
    }
  }
}
</script>

<style scoped></style>
