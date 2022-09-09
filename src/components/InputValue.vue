<template>
  <div class="w-full bg-white min-h-[20px] flex items-center rounded-[6px] justify-center">
    <input
      ref="inputValue"
      v-model="value"
      type="text"
      class="rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      @keyup.enter="onSave"
      @keyup.esc="onCancel"
      @blur="onSave"
    >
  </div>
</template>

<script>

export default {
  emits: ['cancel', 'save'],
  data () {
    return {
      value: '',
      emittedOnce: false
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.$refs.inputValue.focus({ preventScroll: false })
    })
  },
  methods: {
    onCancel () {
      this.emittedOnce = true
      this.$emit('cancel')
    },
    onSave () {
      const text = this.value.trim()
      if (!text) return this.onCancel()
      if (!this.emittedOnce) {
        this.$emit('save', text)
      }
      this.emittedOnce = true
    }
  }
}
</script>
