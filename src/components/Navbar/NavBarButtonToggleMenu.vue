<template>
  <div class="flex h-[48px]">
    <div
      class="flex xl:hidden items-center grow-0 shrink-0 relative cursor-pointer px-3"
      @click.prevent="menuToggleMobile"
    >
      <Icon
        :box="'0 0 24 24'"
        :path="menuToggleMobileIcon"
        size="24"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'

import { mdiForwardburger, mdiBackburger } from '@mdi/js'

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

<style>

</style>
