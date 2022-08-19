<template>
  <aside
    style="overflow-x:hidden; scrollbar-width: none;"
    class="scroll-style w-[310px] fixed top-0 z-30 h-screen transition-position bg-[#f8f8fc] lg:left-[292px] font-SfProDisplayNormal text-sm"
  >
    <div
      class="flex justify-end px-3 my-2"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="hover:cursor-pointer"
        @click="$emit('closeSubMenu')"
      >
        <path
          d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
    </div>
    <!-- old bg bg-[#f4f5f7] -->
    <slot />
  </aside>
</template>
<script>
export default {
  emits: ['closeSubMenu']
}
</script>
