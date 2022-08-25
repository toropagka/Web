<template>
  <div class="fixed flex w-full justify-between left-0">
    <MainMenuSkeleton class="w-[292px] h-[605px]" />
    <div class="w-10/12 h-[1200px] animate-pulse bg-gray-200" />
  </div>
</template>
<script>
import MainMenuSkeleton from '@/components/AsideMenu/MainMenuSkeleton.vue'

export default {
  components: {
    MainMenuSkeleton
  }
}
</script>
