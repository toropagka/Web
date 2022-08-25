<script>
export default {
  props: {
    fotolink: {
      type: String
    },
    name: {
      type: String
    }
  }
}
</script>
<template>
  <div class="flex items-center">
    <img
      :src="fotolink"
      width="35"
      height="35"
      class="rounded-xl mr-2"
    >
    <p class="truncate ...">
      {{ name }}
    </p>
  </div>
</template>
