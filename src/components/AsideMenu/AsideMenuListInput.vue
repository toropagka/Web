<template>
  <div class="w-full border border-[#ff9123] bg-white h-[40px] flex items-center rounded-[10px] justify-center">
    <div class="flex-none flex items-center justify-center h-[30px] w-[30px] ml-[5px] text-[#606061]">
      <slot />
    </div>
    <input
      ref="inputValue"
      v-model="currentValue"
      type="text"
      class="focus:ring-0 focus:outline-none focus:border-0 w-full px-[8px] py-[4px] text-[13px] leading-[15px] text-[#606061] font-roboto"
      @keyup.enter="onSave"
      @keyup.esc="onCancel"
      @blur="onSave"
    >
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValue: '',
    emittedOnce: false
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValue = this.value
          this.emittedOnce = false
          this.$nextTick(function () {
            this.$refs.inputValue.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show && !this.emittedOnce) {
        this.emittedOnce = true
        this.$emit('cancel')
      }
    },
    onSave () {
      const text = this.currentValue.trim()
      if (!text) return this.onCancel()
      if (this.show && !this.emittedOnce) {
        this.emittedOnce = true
        this.$emit('save', text)
      }
    }
  }
}
</script>

<style scoped></style>
