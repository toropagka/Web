<template>
  <Transition>
    <div class="flex items-start justify-end mb-4 space-x-[8px]">
      <div
        class="bg-[#EAF2FC] max-w-[334px] py-[12px] px-[15px]"
        style="border-radius: 11px 0px 11px 11px;"
      >
        <p
          class="text-[#4C4C4D] font-[500] text-[14px] leading-[19px] max-w-full text-right break-words clamp"
        >
          {{ message }}
        </p>
        <span
          class="leading-[13px] font-[700] text-[11px] text-right float-right"
          style="color: rgba(0, 0, 0, 0.4);"
        >
          {{ getMessageTimeString(date) }}
        </span>
      </div>
      <img
        :src="user.foto_link"
        width="30"
        height="30"
        class="rounded-[8px]"
      >
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    }
  },
  methods: {
    getMessageTimeString (dateCreate) {
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  }

}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 2s ease;
}

.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
