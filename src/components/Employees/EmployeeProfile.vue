<template>
  <div class="flex items-center">
    <img
      v-if="photo"
      :src="photo"
      class="h-[22px] w-[22px] rounded-md mr-1"
    >
    <span class="text-[12px]">
      {{ name }}
    </span>
  </div>
</template>
<script>
export default {
  props: {
    photo: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
