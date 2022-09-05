<template>
  <section
    class="px-0 md:px-3"
    :class="[ isFullScreen ? 'flex min-h-screen h-full justify-center' : 'pb-2', lastRoute === 'login' ? 'items-center' : '']"
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
    }
  }
}
</script>
