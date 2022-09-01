<template>
  <section
    class="px-0 md:px-3"
    :class="[ isFullScreen ? 'flex min-h-screen h-full justify-center' : 'pb-2', lastTab === 'directory' ? 'pt-[0px]' : '', lastRoute === 'login' ? 'items-center' : '']"
  >
    <slot />
  </section>
</template>

<script>
export default {
  computed: {
    lastRoute () {
      return this.$router.currentRoute.value.name
    },
    isFullScreen () {
      return this.$store.state.isFullScreen
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    }
  }
}
</script>
