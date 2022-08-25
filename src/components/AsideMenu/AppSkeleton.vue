<template>
  <div class="fixed flex w-full justify-between left-0">
    <AsideMenuSkeleton class="w-[292px] h-[605px]" />
    <div class="w-10/12 h-[1200px] animate-pulse bg-gray-200" />
  </div>
</template>
<script>
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'

export default {
  components: {
    AsideMenuSkeleton
  }
}
</script>
