<script setup>
import AsideMenuItem from '@/components/AsideMenuItem.vue'

defineProps({
  isSubmenuList: {
    type: Boolean,
    default: false
  },
  menu: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
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
