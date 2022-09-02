<template>
  <div class="flex items-center bg-white h-[40px] rounded-[8px]">
    <input
      ref="inputValue"
      v-model="value"
      type="text"
      class="focus:ring-0 focus:outline-none focus:border-0 w-full px-[20px] py-[4px] text-[13px] leading-[15px] text-[#2e2e2e] font-roboto"
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
        this.emittedOnce = true
        this.$emit('save', text)
      }
    }
  }
}
</script>
