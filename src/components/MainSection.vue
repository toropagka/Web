<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isFullScreen = computed(() => store.state.isFullScreen)

const lastTab = computed(() => store.state.navigator.lastTab)
</script>

<template>
  <section
    class="px-0 md:px-3"
    :class="[ isFullScreen ? 'flex min-h-screen h-full items-center justify-center' : 'pb-2 pt-[60px]', lastTab === 'directory' ? 'pt-[30px]' : 'pt-[60px]' ]"
  >
    <slot />
  </section>
</template>
