<template>
  <ModalBox
    :title="title"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="flex flex-col w-full">
      <input
        v-model="formTitle"
        placeholder="Заголовок формы"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          checked
          class="rounded-[5px] mr-[10px]"
        >
        <input
          v-model="name"
          placeholder="Имя"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          checked
          class="rounded-[5px] mr-[10px]"
        >
        <input
          v-model="email"
          placeholder="Адрес электронной почты"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          checked
          class="rounded-[5px] mr-[10px]"
        >
        <input
          v-model="phone"
          placeholder="Телефон"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          checked
          class="rounded-[5px] mr-[10px]"
        >
        <input
          v-model="comment"
          placeholder="Комментарий"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <input
        v-model="buttonText"
        placeholder="Надпись на кнопке"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <input
        v-model="redirectLink"
        placeholder="Ссылка для редиректа"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-2 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <button
        class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
        @click="onSave"
      >
        Создать форму
      </button>
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['yes', 'cancel'],

  data: () => ({
    currentValue: ''
  }),

  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      this.$emit('yes')
    }
  }
}
</script>

<style scoped>

</style>
