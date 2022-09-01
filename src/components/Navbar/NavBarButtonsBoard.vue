<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxDelete
      v-if="showDeleteBoard"
      title="Удалить доску"
      :text="deleteMessage"
      @cancel="showDeleteBoard = false"
      @yes="onDeleteBoard"
    />
    <BoardModalBoxRename
      v-if="showAddBoard"
      :show="showAddBoard"
      title="Добавить доску"
      @cancel="showAddBoard = false"
      @save="onAddNewBoard"
    />
    <PopMenu>
      <NavBarButtonIcon
        icon="filter"
        :colored="isFilterSet"
      />
      <template #menu>
        <PopMenuItem
          :icon="showOnlyCardsWhereIAmResponsible ? 'check' : 'uncheck'"
          @click="clickBoardMyCards"
        >
          Ответственный я
        </PopMenuItem>
        <PopMenuItem
          :icon="showOnlyCardsWithNoResponsible ? 'check' : 'uncheck'"
          @click="clickBoardNoResponsibleCards"
        >
          Нет ответственного
        </PopMenuItem>
        <PopMenuItem
          :icon="showOnlyMyCreatedCards ? 'check' : 'uncheck'"
          @click="clickBoardMyCardsCreated"
        >
          Создатель я
        </PopMenuItem>
        <PopMenuItem
          :icon="showArchive ? 'check' : 'uncheck'"
          @click="clickBoardArchive"
        >
          Архив
        </PopMenuItem>
        <PopMenuDivider
          v-if="isFilterSet"
        />
        <PopMenuItem
          v-if="isFilterSet"
          icon="uncheck"
          @click="clickBoardFilterClear"
        >
          Сбросить
        </PopMenuItem>
      </template>
    </PopMenu>
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          icon="edit"
          @click="clickEditBoard"
        >
          Свойства доски
        </PopMenuItem>
        <PopMenuItem
          v-if="canEditBoard"
          icon="add"
          @click="clickAddBoard"
        >
          Создать поддоску
        </PopMenuItem>
        <PopMenuItem
          v-if="canEditBoard"
          icon="delete"
          @click="clickDeleteBoard"
        >
          Удалить доску
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'

import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'
import * as CARD from '@/store/actions/cards'

import { NAVIGATOR_REMOVE_BOARD } from '@/store/actions/navigator'
import { uuidv4 } from '@/helpers/functions'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxRename,
    BoardModalBoxDelete
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    }
  },
  emits: ['popNavBar'],
  data () {
    return {
      showDeleteBoard: false,
      showBoardsLimit: false,
      showAddBoard: false
    }
  },
  computed: {
    deleteMessage () {
      if (this.board.children.length !== 0) {
        return 'Вы действительно хотите удалить доску? \n\n Внимание! Все дочерние доски будут удалены.'
      }
      return 'Вы действительно хотите удалить доску?'
    },
    board () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    canEditBoard () {
      return this.board?.email_creator === this.$store.state.user.user?.current_user_email
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.board?.email_creator === user.current_user_email
    },
    showArchive () {
      return this.$store.state.boards.showArchive
    },
    showOnlyCardsWhereIAmResponsible () {
      return this.$store.state.boards.showOnlyCardsWhereIAmResponsible
    },
    showOnlyCardsWithNoResponsible () {
      return this.$store.state.boards.showOnlyCardsWithNoResponsible
    },
    showOnlyMyCreatedCards () {
      return this.$store.state.boards.showOnlyMyCreatedCards
    },
    isFilterSet () {
      return this.showOnlyMyCreatedCards || this.showOnlyCardsWhereIAmResponsible || this.showArchive || this.showOnlyCardsWithNoResponsible
    }
  },
  methods: {
    clickEditBoard () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'board' })
      this.$store.commit(BOARD.SELECT_BOARD, this.board)
    },
    clickDeleteBoard () {
      this.showDeleteBoard = true
    },
    clickAddBoard () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.boards.boards).length >= 3 && user.days_left <= 0) {
        this.showBoardsLimit = true
        return
      }
      this.showAddBoard = true
    },
    onAddNewBoard (name) {
      this.showAddBoard = false
      const title = name.trim()
      if (title) {
        // добавляем новую доску и переходим в неё
        const maxOrder =
          this.board?.children?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) ?? 0
        const user = this.$store.state.user.user
        const members = {}
        members[user.current_user_uid] = 1
        const board = {
          uid: uuidv4(),
          name: title,
          uid_parent: this.board.uid,
          email_creator: user.current_user_email,
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
    },
    onDeleteBoard () {
      this.showDeleteBoard = false
      //
      this.$store.dispatch(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(BOARD.SELECT_BOARD, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_BOARD, this.board)
          // для актуального значения количества досок
          this.$store.commit(BOARD.REMOVE_BOARD_REQUEST, this.boardUid)
          //
          this.$emit('popNavBar')
          this.$router.push('/board')
        })
    },
    clickBoardMyCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, !this.showOnlyCardsWhereIAmResponsible)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, false)
    },
    clickBoardNoResponsibleCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, !this.showOnlyCardsWithNoResponsible)
    },
    clickBoardMyCardsCreated () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CREATED_CARDS, !this.showOnlyMyCreatedCards)
    },
    clickBoardArchive () {
      this.$store.commit(BOARD.SHOW_BOARD_ARCHIVE, !this.showArchive)
    },
    clickBoardFilterClear () {
      this.$store.commit(BOARD.BOARD_CLEAR_FILTER)
    }
  }
}
</script>

<style scoped>

</style>
