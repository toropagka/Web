<template>
  <div class="w-full">
    <div
      v-if="!displayModal"
      class="pt-[30px]"
    >
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
      </div>
    </div>
    <div
      v-if="displayModal"
      class="flex flex-col justify-center items-center "
    >
      <img
        class="mx-auto mt-10"
        width="320"
        height="314"
        src="@/assets/images/boards.svg"
        alt="Empty task image"
      >
      <div class="w-[600px]">
        <p class="font-bold p-3">
          Визуализируйте цели, проекты и командную работу с помощью досок
        </p>
        <ul class="list-decimal pl-[30px]">
          <li class="p-3 text-sm">
            Мои доски - это ваши доски. Вы можете установить цвет для доски и добавить коллег с определенными правами, чтобы приступить к совместной работе
          </li>
          <li class="p-3 text-sm">
            Общие доски - доски, к которым вам дали доступ
          </li>
          <li class="p-3 text-sm">
            Участники доски видят все карточки в ней
          </li>
        </ul>
      </div>
      <button
        class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[20px]"
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
import BoardModalBoxBoardsLimit from '@/components/Board/BoardModalBoxBoardsLimit.vue'
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import BoardInputValue from './Board/BoardInputValue.vue'
import { uuidv4 } from '@/helpers/functions'

export default {
  components: {
    Icon,
    BoardModalBoxBoardsLimit,
    BoardBlocItem,
    ListBlocAdd,
    BoardInputValue
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false,
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
    },
    displayModal () {
      return !this.$store.state.onboarding?.visitedModals?.includes('boards') && this.$store.state?.onboarding?.showModals
    },
    boards () {
      return this.$store.getters.sortedNavigator.new_private_boards
    }
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
      this.$router.push(`/board/${board.uid}`)
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
          uid: uuidv4(),
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
      this.$store.commit(USER_VIEWED_MODAL, 'boards')
    }
  }
}
</script>

<style scoped></style>
