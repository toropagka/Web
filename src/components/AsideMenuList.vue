<script>
import AsideMenuItem from '@/components/AsideMenuItem.vue'

export default {
  components: {
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
    }
  },
  emits: ['menu-click'],
  methods: {
    menuClick (event, item) {
      this.$emit('menu-click', event, item)
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
    </template>
  </ul>
</template>
