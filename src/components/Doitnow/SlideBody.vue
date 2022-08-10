<template>
  <div
    class="taskName p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden"
  >
    {{ title }}
  </div>
  <div
    class="description-content pl-5 mt-5"
  >
    <div
      class="font-[400] text-[14px] leading-[21px] text-[#4C4C4D] w-[50rem]"
      v-html="text"
    />
  </div>
  <div
    v-if="video"
    class="font-[400] text-[14px] leading-[21px] pl-5 text-[#4C4C4D] mt-5"
  >
    <iframe
      width="560"
      height="315"
      :src="video"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="border rounded-xl"
    />
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: 'text'
    },
    video: {
      type: String,
      default: 'text'
    }
  }
}
</script>
