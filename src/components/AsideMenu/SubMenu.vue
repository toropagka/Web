<template>
  <div
    style="overflow-x:hidden; scrollbar-width: none;"
    class="scroll-style w-[292px] fixed top-0 z-30 h-screen transition-position bg-[#f4f5f7] lg:left-[292px] font-SfProDisplayNormal text-sm"
  >
    <slot />
  </div>
</template>
<script>
export default {
  emits: ['closeSubMenu']
}
</script>
