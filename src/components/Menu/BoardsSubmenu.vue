<template>
  <BoardModalBoxBoardsLimit
    v-if="showBoardsLimit"
    @cancel="showBoardsLimit = false"
    @ok="showBoardsLimit = false"
  />
  <div class="px-3">
    <template
      v-for="(value, index) in items"
      :key="index"
    >
      <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold py-3 mt-[10px]">
        {{ value.dep }}
      </p>
      <div
        class="grid gap-2 mt-[5px] grid-cols-1"
      >
        <template
          v-for="board in value.items"
          :key="board.uid"
        >
          <BoardBlocItem
            :board="board"
            @click.stop="gotoChildren(board)"
          />
        </template>
        <BoardInputValue
          v-if="showAddBoard && index == 0"
          :show="showAddBoard"
          class="h-[48px]"
          @cancel="showAddBoard = false"
          @save="onAddNewBoard"
        />
        <ListBlocAdd
          v-else-if="index == 0"
          @click.stop="clickAddBoard"
        />
      </div>
    </template>
  </div>
</template>
<script>
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardInputValue from '@/components/Board/BoardInputValue.vue'
import * as CARD from '@/store/actions/cards.js'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    BoardBlocItem,
    ListBlocAdd,
    BoardInputValue,
    BoardModalBoxBoardsLimit
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['closeSubMenu'],
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    user () {
      return this.$store.state.user.user
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  methods: {
    clickAddBoard () {
      // если лицензия истекла
      if (Object.keys(this.$store.state.boards.boards).length >= 3 && this.user.days_left <= 0) {
        this.showBoardsLimit = true
        return
      }
      this.showAddBoard = true
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onAddNewBoard (name) {
      this.showAddBoard = false
      const title = name.trim()
      if (title) {
        // добавляем новую доску и переходим в неё
        const maxOrder =
          this.boards[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const members = {}
        members[this.user.current_user_uid] = 1
        const board = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          email_creator: this.user.current_user_email,
          order: maxOrder + 1,
          collapsed: 0,
          color: '',
          public_link_status: 0,
          show_date: 0,
          favorite: 0,
          stages: [],
          children: [],
          members
        }
        console.log(`create board uid: ${board.uid}`, board)
        this.$store.dispatch(BOARD.CREATE_BOARD_REQUEST, board).then((res) => {
          // заполняем недостающие параметры
          board.global_property_uid = '1b30b42c-b77e-40a4-9b43-a19991809add'
          board.type_access = res.data.type_access
          board.color = '#A998B6'
          //
          this.$store.commit(BOARD.PUSH_BOARD, [board])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_BOARD, [board])
          this.gotoChildren(board)
        })
      }
    },
    mainStateUpdate () {
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'new_private_boards' })
      const navElem = {
        name: 'Доски',
        key: 'greedSource',
        greedPath: 'new_private_boards',
        value: this.storeNavigator.new_private_boards?.items
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.new_private_boards?.items })
    },
    gotoChildren (board) {
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      this.mainStateUpdate()
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
      this.$emit('closeSubMenu')
    }
  }
}
</script>
