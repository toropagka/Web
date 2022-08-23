<template>
  <section
    class="px-0 md:px-3"
    :class="[ isFullScreen ? 'flex min-h-screen h-full items-center justify-center' : 'pb-2 pt-[60px]', lastTab === 'directory' ? 'pt-[30px]' : 'pt-[60px]' ]"
  >
    <slot />
  </section>
</template>

<script>
export default {
  computed: {
    isFullScreen () {
      return this.$store.state.isFullScreen
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    }
  }
}
</script>
