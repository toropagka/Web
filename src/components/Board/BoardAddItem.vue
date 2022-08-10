<template>
  <div class="w-full bg-white h-[50px] flex items-center rounded-[6px] justify-center px-[5px]">
    <input
      ref="inputValue"
      v-model="currentValue"
      type="text"
      class=" rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      @keyup.enter="onSave"
      @keyup.esc="onCancel"
    >
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
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
    currentValue: ''
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValue = this.value
          this.$nextTick(function () {
            this.$refs.inputValue.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show) this.$emit('cancel')
    },
    onSave () {
      if (this.show) this.$emit('save', this.currentValue)
    }
  }
}
</script>

<style scoped></style>
