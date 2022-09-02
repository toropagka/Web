<template>
  <div
    class="flex items-center rounded-[8px] px-[20px] h-[40px] cursor-pointer"
    :class="{ 'border border-[#ff9123] bg-white -mx-px': selected, 'hover:bg-white/60': !selected }"
  >
    <div class="flex items-center relative w-full">
      <div
        v-if="count > 0"
        class="min-w-[13px] min-h-[13px] absolute rounded-[3px] bg-[#4c4c4d] -top-[3px] -left-[4px] flex items-center justify-center"
      >
        <span
          class="text-white font-['Roboto'] text-[10px] leading-[12px] font-medium px-0.5"
        >
          {{ count }}
        </span>
      </div>
      <div
        class="flex-none h-[22px] w-[22px] rounded-[6px] border border-black/10"
        :style="{ 'background-color': bgColor }"
      >
        <slot />
      </div>
      <div class="flex-initial ml-[14px] overflow-hidden">
        <p
          class="font-roboto text-[#4c4c4d] text-[13px] leading-[15px] font-medium truncate"
        >
          {{ title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgColor () {
      if (this.color !== '' && this.color !== '#A998B6') {
        return this.color
      }
      return ''
    }
  }
}
</script>

<style scoped></style>
