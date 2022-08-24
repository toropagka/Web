<script>
import AsideMenuItem from '@/components/AsideMenu/AsideMenuItem.vue'
import AsideMenuAssigments from '@/components/AsideMenu/AsideMenuAssigments'

export default {
  components: {
    AsideMenuAssigments,
    AsideMenuItem
  },
  props: {
    isSubmenuList: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    },
    assigments: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['menu-click', 'assigments-click'],
  computed: {
    lastTab () {
      return this.$store.state.navigator.lastTab
    }
  },
  methods: {
    menuClick (event, item) {
      this.$emit('menu-click', event, item)
    },
    assigmentsClick (item) {
      this.$emit('assigments-click', item)
    }
  }
}
</script>

<template>
  <ul>
    <template
      v-for="(item, index) in menu"
      :key="index"
    >
      <aside-menu-item
        :id="item.path === 'other' ? 'step5' : ''"
        :item="item"
        :is-submenu-list="isSubmenuList"
        @menu-click="menuClick"
      />
      <!-- Отслеживаем uid вкладки 'Готово к сдаче' и после нее рендерим поручения -->
      <AsideMenuAssigments
        v-if="item.uid === 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0'"
        :assigments="assigments"
        @assigments-click="assigmentsClick"
      />
    </template>
  </ul>
</template>
