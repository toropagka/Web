<template>
  <li class="px-[16px]">
    <component
      :is="componentIs"
      v-slot="vSlot"
      :to="itemTo"
      :href="itemHref"
      :target="itemTarget"
      class="h-[40px] flex items-center cursor-pointer hover:bg-white hover:rounded-[10px]"
      :class="{
        'p-3 text-sm': isSubmenuList,
        'bg-white rounded-[10px]': isActive
      }"
      @click="menuClick"
    >
      <div class="flex items-center justify-center ml-[5px] mr-[8px]">
        <Icon
          :path="item.icon"
          class="flex-none"
          :box="item.iconBox"
          :width="item.width"
          :height="item.height"
          :class="[isActive ? styleActive : styleInactive, item.iconBackgroundClass]"
        />
      </div>
      <span
        class="font-roboto text-[13px] leading-[15px]"
        :class="[isActive ? styleActive : styleInactive]"
      >
        {{ item.label }}
      </span>
      <Icon
        v-if="hasDropdown"
        :path="dropdownIcon"
        class="flex-none"
        :class="[vSlot && vSlot.isExactActive ? styleActive : styleInactive]"
      />
    </component>
  </li>
</template>

<script>
import { mdiMinus, mdiPlus } from '@mdi/js'
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    isSubmenuList: Boolean
  },
  emits: ['menu-click'],
  data () {
    return {
      isDropdownActive: false,
      styleActive: 'font-bold text-[#424242]',
      styleInactive: 'font-medium text-[#606061]'
    }
  },
  computed: {
    navStack () {
      return this.$store.state.navbar.navStack
    },
    componentIs () {
      return this.item.to ? 'router-link' : 'a'
    },
    hasDropdown () {
      return !!this.item.menu
    },
    dropdownIcon () {
      return this.isDropdownActive ? mdiMinus : mdiPlus
    },
    itemTo () {
      return this.item.to || null
    },
    itemHref () {
      return this.item.href || null
    },
    itemTarget () {
      return this.componentIs.value === 'a' && this.item.target ? this.item.target : null
    },
    isActive () {
      return this.item.uid === this.navStack[0]?.value?.uid || this.item.label === this.navStack[0]?.name ? 1 : 0
    }
  },
  methods: {
    menuClick (event) {
      this.$emit('menu-click', event, this.item)

      if (this.hasDropdown) {
        this.isDropdownActive = !this.isDropdownActive
      }
    }
  }
}
</script>
