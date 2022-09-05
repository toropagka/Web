<template>
  <div
    class="ml-0 space-x-1 flex items-center grow-0 shrink-0 relative font-light text-gray-700 dark:text-white dark:hover:text-gray-400 px-3 group"
  >
    <div
      class="h-[24px] w-[24px] block xl:hidden shrink-0 cursor-pointer"
      @click="menuToggleMobile"
    >
      <Icon
        :box="'0 0 24 24'"
        :path="menuToggleMobileIcon"
        size="24"
      />
    </div>
    <span class="font-['Roboto'] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[16px] breadcrumbs text-[#4C4C4D] font-[700]">
      <slot />
    </span>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
import { mdiBackburger, mdiForwardburger } from '@mdi/js'

export default {
  components: {
    Icon
  },
  data () {
    return {
      mdiForwardburger,
      mdiBackburger
    }
  },
  computed: {
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    menuToggleMobileIcon () {
      return this.isAsideMobileExpanded ? this.mdiBackburger : this.mdiForwardburger
    }
  },
  methods: {
    menuToggleMobile () {
      this.$store.dispatch('asideMobileToggle')
    }
  }
}
</script>
