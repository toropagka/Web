<template>
  <nav class="flex items-center h-[56px]">
    <NavBarButtonToggleMenu class="flex-1 items-stretch" />
    <div class="flex gap-[12px] items-center w-full overflow-hidden">
      <NavBarBreadcrumb
        v-if="title"
        :breadcrumb="{ name: title, to: route, showNext: !!breadcrumbs.length, selected: !breadcrumbs.length }"
        class="flex-none"
      />
      <NavBarBreadcrumb
        v-if="showDots"
        :breadcrumb="{ name: '...', showNext: true }"
        class="flex-none"
      />
      <NavBarBreadcrumb
        v-for="(breadcrumb, index) in breadcrumbsShow"
        :key="index"
        :breadcrumb="breadcrumb"
        class="flex-initial"
      />
    </div>
    <div class="flex-none flex gap-[10px] items-center px-[12px]">
      <slot />
    </div>
  </nav>
</template>

<script>
import NavBarButtonToggleMenu from '@/components/Navbar/NavBarButtonToggleMenu.vue'
import NavBarBreadcrumb from '@/components/Navbar/NavBarBreadcrumb.vue'

export default {
  components: {
    NavBarButtonToggleMenu,
    NavBarBreadcrumb
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    route: {
      type: String,
      default: ''
    },
    breadcrumbs: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    showDots () {
      return this.breadcrumbs.length > 2
    },
    breadcrumbsShow () {
      return this.breadcrumbs.slice(-2)
    }
  }
}
</script>
