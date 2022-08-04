<template>
  <div class="w-full">
    <div
      v-if="!displayModal"
    >
      <BoardModalBoxRename
        v-if="showAddBoard"
        :show="showAddBoard"
        title="Добавить доску"
        @cancel="showAddBoard = false"
        @save="onAddNewBoard"
      />
      <BoardModalBoxBoardsLimit
        v-if="showBoardsLimit"
        @cancel="showBoardsLimit = false"
        @ok="showBoardsLimit = false"
      />
      <div
        v-for="(value, index) in boards"
        :key="index"
      >
        <div
          class="flex items-center w-full"
          :class="{ 'justify-between': index == 0, 'mt-[28px]': index == 1 }"
        >
          <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
            {{ value.dep }}
          </p>
          <div
            v-if="index == 0"
            class="flex"
          >
            <icon
              :path="listView.path"
              :width="listView.width"
              :height="listView.height"
              :box="listView.viewBox"
              class="cursor-pointer hover:text-gray-800 mr-2"
              :class="{
                'text-gray-800': !isGridView,
                'text-gray-400': isGridView
              }"
              @click="updateGridView(false)"
            />
            <icon
              :path="gridView.path"
              :width="gridView.width"
              :height="gridView.height"
              :box="gridView.viewBox"
              class="cursor-pointer hover:text-gray-800 mr-2"
              :class="{
                'text-gray-800': isGridView,
                'text-gray-400': !isGridView
              }"
              @click="updateGridView(true)"
            />
          </div>
        </div>
        <div
          class="grid gap-2 mt-3 grid-cols-1"
          :class="{
            'md:grid-cols-2 lg:grid-cols-4': isGridView,
            'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
          }"
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
          <ListBlocAdd
            v-if="index == 0"
            @click.stop="clickAddBoard"
          />
        </div>
      </div>
    </div>
    <div
      v-if="displayModal"
      class="flex flex-col justify-center items-center"
    >
      <img
        class="mx-auto mt-4"
        width="320"
        height="314"
        src="@/assets/images/pic.png"
        alt="Empty task image"
      >
      <p class="font-bold p-2">
        Доски – самый простой способ визуализировать ваши цели, проекты и командную работу
      </p>
      <p class="text-sm p-2 w-[600px]">
        Создавайте карточки, перемещайте их между этапами, приглашайте коллег для совместной работы – весь рабочий процесс у вас перед глазами
      </p>
      <button
        class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
        @click="okToModal"
      >
        Понятно
      </button>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import * as CARD from '@/store/actions/cards.js'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    Icon,
    BoardModalBoxRename,
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    ListBlocAdd
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
      showBoardsLimit: false,
      displayModal: false,
      gridView,
      listView
    }
  },
  computed: {
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  mounted: function () {
    if (this.$store.state.user.visitedModals.includes('boards')) {
      return
    }
    this.displayModal = this.$store.state.user.showModals
  },
  methods: {
    print (val) {
      console.log(val)
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    gotoChildren (board) {
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
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
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
          this.boards[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const user = this.$store.state.user.user
        const members = {}
        members[user.current_user_uid] = 1
        const board = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
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
    okToModal () {
      this.displayModal = false
      this.$store.state.user.visitedModals.push('boards')
    }
  }
}
</script>

<style scoped></style>
