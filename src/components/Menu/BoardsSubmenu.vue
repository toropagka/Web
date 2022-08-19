<template>
  <div class="px-3">
    <template
      v-for="(value, idx) in items"
      :key="idx"
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
      </div>
    </template>
  </div>
</template>
<script>
import BoardBlocItem from '@/components/Board/BoardBlocItem.vue'
import * as CARD from '@/store/actions/cards.js'

export default {
  components: {
    BoardBlocItem
  },
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  emits: ['closeSubMenu'],
  computed: {
    storeNavigator () {
      return this.$store.state.navigator.navigator
    }
  },
  methods: {
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
