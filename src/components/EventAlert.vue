<template>
  <div
    :style="{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }"
    class="p-2 rounded-[8px] border-2 flex text-sm items-center h-[36px] w-[185px] mt-1 cursor-pointer text-center"
    @click="redirect"
  >
    <p
      class="w-full mx-3.5"
      :style="{ color: textColor }"
    >
      {{ messageText }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: 'white'
    },
    textColor: {
      type: String,
      default: 'black'
    },
    borderColor: {
      type: String,
      default: '#FF912380'
    },
    messageText: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },
  methods: {
    redirect () {
      if (this.link.length) {
        window.open(this.link)
      }
    }
  }
}
</script>
