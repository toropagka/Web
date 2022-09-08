<template>
  <PopMenuItem
    style="padding-left: 8px;"
  >
    <div class="flex justify-between w-full items-center max-w-[205px]">
      <div class="flex items-center max-w-[205px]">
        <img
          v-if="photo"
          :src="photo"
          class="flex-none rounded-[7px] mr-[6px]"
          width="24"
          height="24"
        >
        <div
          class="ml-[2px] truncate"
          :class="showCheckMark ? 'font-bold' : ''"
        >
          {{ name }}
        </div>
      </div>
      <div
        v-if="showCheckMark"
        class="ml-[10px]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3346 4L6.0013 11.3333L2.66797 8"
            stroke="#1CA345"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </PopMenuItem>
</template>

<script>
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

export default {
  components: {
    PopMenuItem
  },
  props: {
    userEmail: {
      type: String,
      default: ''
    },
    showCheckMark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    photo () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.fotolink || ''
    },
    name () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.name || this.userEmail
    }
  }
}
</script>

<style scoped>
</style>
