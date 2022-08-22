<template>
  <aside
    style="overflow-x:hidden; scrollbar-width: none;"
    class="scroll-style w-[310px] fixed top-0 z-30 h-screen transition-position bg-[#f8f8fc] lg:left-[292px] font-SfProDisplayNormal text-sm"
  >
    <!-- old bg bg-[#f4f5f7] -->
    <slot />
  </aside>
</template>
<script>
export default {
  emits: ['closeSubMenu']
}
</script>
