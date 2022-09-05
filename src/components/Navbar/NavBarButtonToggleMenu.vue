<template>
  <div class="flex h-[48px]">
    <NavBarItem
      type="flex lg:hidden"
      @click.prevent="menuToggleMobile"
    >
      <Icon
        :box="'0 0 24 24'"
        :path="menuToggleMobileIcon"
        size="24"
      />
    </NavBarItem>
  </div>
</template>

<script>
import NavBarItem from '@/components/NavBarItem.vue'
import Icon from '@/components/Icon.vue'

import { mdiForwardburger, mdiBackburger } from '@mdi/js'

export default {
  components: {
    NavBarItem,
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
