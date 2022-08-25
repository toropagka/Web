<template>
  <BoardModalBoxBoardsLimit
    v-if="showBoardsLimit"
    @cancel="showBoardsLimit = false"
    @ok="showBoardsLimit = false"
  />
  <div class="px-[16px] pt-[15px]">
    <AsideMenuListSkeleton v-if="status == 'loading'" />
    <template v-if="status == 'success'">
      <AsideMenuListTitle v-if="favoriteBoards.length">
        Избранные доски
      </AsideMenuListTitle>
      <template
        v-for="board in favoriteBoards"
        :key="board.uid"
      >
        <BoardsSubmenuItem
          :board="board"
          @click="gotoChildren(board)"
        />
      </template>
      <template
        v-for="(value, index) in items"
        :key="index"
      >
        <AsideMenuListTitle>
          {{ value.dep }}
        </AsideMenuListTitle>
        <template
          v-for="board in value.items"
          :key="board.uid"
        >
          <BoardsSubmenuItem
            :board="board"
            @click="gotoChildren(board)"
          />
        </template>
        <AsideMenuListInput
          v-if="showAddBoard && index == 0"
          :show="showAddBoard"
          @cancel="showAddBoard = false"
          @save="onAddNewBoard"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.2 18C2.53878 18 2 17.4623 2 16.8005V4.93771C2 4.27591 2.53878 3.7382 3.2 3.7382H6.08163V2.88613C6.08163 2.59659 6.3102 2.36496 6.59592 2.36496H8.18775L8.22857 2.25742C8.4898 1.50462 9.20816 1 10 1C10.7918 1 11.5102 1.50462 11.7714 2.25742L11.8122 2.36496H13.4041C13.6898 2.36496 13.9184 2.59659 13.9184 2.88613V3.7382H16.8C17.4612 3.7382 18 4.27591 18 4.93771V16.8005C18 17.4623 17.4612 18 16.8 18H3.2ZM3.03673 16.9659H16.9714V4.77226H13.9184V5.62433C13.9184 5.91387 13.6898 6.1455 13.4041 6.1455H6.59592C6.3102 6.1455 6.08163 5.91387 6.08163 5.62433V4.77226H3.03673V16.9659ZM7.11837 5.10316H12.8898V3.4073H11.3633C11.0776 3.4073 10.849 3.17567 10.849 2.88613C10.849 2.4146 10.4735 2.03406 10.0082 2.03406C9.54286 2.03406 9.15918 2.4146 9.15918 2.88613C9.15918 3.17567 8.93061 3.4073 8.6449 3.4073H7.11837V5.10316ZM13.3061 14.2608C12.9633 14.2608 12.6939 13.9796 12.6939 13.6404V12.8545C12.6939 12.5071 12.9714 12.2341 13.3061 12.2341H15.0531C15.3959 12.2341 15.6653 12.5153 15.6653 12.8545V13.6404C15.6653 13.9878 15.3878 14.2608 15.0531 14.2608H13.3061ZM9.22449 14.2608C8.8898 14.2608 8.61225 13.9796 8.61225 13.6404V12.8545C8.61225 12.5071 8.8898 12.2341 9.22449 12.2341H10.9714C11.3143 12.2341 11.5837 12.5153 11.5837 12.8545V13.6404C11.5837 13.9878 11.3061 14.2608 10.9714 14.2608H9.22449ZM4.94694 14.2608C4.60408 14.2608 4.33469 13.9796 4.33469 13.6404V12.8545C4.33469 12.5071 4.61224 12.2341 4.94694 12.2341H6.69388C7.02857 12.2341 7.30612 12.5153 7.30612 12.8545V13.6404C7.30612 13.9878 7.02857 14.2608 6.69388 14.2608H4.94694ZM13.3061 10.3231C12.9633 10.3231 12.6939 10.0419 12.6939 9.70268V8.90852C12.6939 8.56934 12.9714 8.28808 13.3061 8.28808H15.0531C15.3959 8.28808 15.6653 8.56934 15.6653 8.90852V9.6944C15.6653 10.0336 15.3878 10.3148 15.0531 10.3148H13.3061V10.3231ZM9.22449 10.3231C8.8898 10.3231 8.61225 10.0419 8.61225 9.70268V8.90852C8.61225 8.56934 8.8898 8.28808 9.22449 8.28808H10.9714C11.3143 8.28808 11.5837 8.56934 11.5837 8.90852V9.6944C11.5837 10.0336 11.3061 10.3148 10.9714 10.3148H9.22449V10.3231ZM4.94694 10.3231C4.60408 10.3231 4.33469 10.0419 4.33469 9.70268V8.90852C4.33469 8.56934 4.61224 8.28808 4.94694 8.28808H6.69388C7.02857 8.28808 7.30612 8.56934 7.30612 8.90852V9.6944C7.30612 10.0336 7.02857 10.3148 6.69388 10.3148H4.94694V10.3231Z"
              fill="currentColor"
            />
          </svg>
        </AsideMenuListInput>
        <AsideMenuListAdd
          v-else-if="index == 0"
          title="Добавить доску"
          @click.stop="clickAddBoard"
        />
      </template>
    </template>
  </div>
</template>

<script>
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import AsideMenuListTitle from '@/components/AsideMenu/AsideMenuListTitle.vue'
import AsideMenuListAdd from '@/components/AsideMenu/AsideMenuListAdd.vue'
import AsideMenuListInput from '@/components/AsideMenu/AsideMenuListInput.vue'
import BoardsSubmenuItem from '@/components/AsideMenu/BoardsSubmenuItem.vue'
import AsideMenuListSkeleton from '@/components/AsideMenu/AsideMenuListSkeleton.vue'

import * as CARD from '@/store/actions/cards.js'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    BoardModalBoxBoardsLimit,
    AsideMenuListTitle,
    AsideMenuListAdd,
    AsideMenuListInput,
    BoardsSubmenuItem,
    AsideMenuListSkeleton
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    user () {
      return this.$store.state.user.user
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
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
    items () {
      return this.storeNavigator?.new_private_boards ?? []
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
          this.items[0]?.items?.reduce(
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
    gotoChildren (board) {
      localStorage.setItem('lastTab', 'tasks')
      // закрываем сабменю
      this.$store.state.navigator.submenu.status = false

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
      localStorage.setItem('lastTab', 'new_private_boards')
    }
  }
}
</script>
