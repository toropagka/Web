<template>
  <div class="flex">
    <span
      class="bg-[#424242] w-full justify-center px-5 h-[34px] rounded-[8px] text-[#FFFFFF] text-sm mr-[7px] hover:bg-[#8c8989] hover:cursor-pointer flex items-center"
    >
      {{ title }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
