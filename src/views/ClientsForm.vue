<template>
  <div class="h-full flex items-center justify-center max-w-[400px] mx-auto">
    <div class="flex flex-col w-full bg-[#F9F9F9] p-[25px] shadow-2xl">
      <h1 class="mb-[15px] text-[30px] text-center text-[#777]">
        {{ item.title }}
      </h1>
      <input
        v-if="item.inputs.input1"
        v-model="modelInput1"
        :placeholder="item.inputs.input1"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <input
        v-if="item.inputs.input2"
        v-model="modelInput2"
        :placeholder="item.inputs.input2"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <input
        v-if="item.inputs.input3"
        v-model="modelInput3"
        :placeholder="item.inputs.input3"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <input
        v-if="item.inputs.input4"
        v-model="modelInput4"
        :placeholder="item.inputs.input4"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
      >
      <button
        class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
        @click="submitForm"
      >
        {{ item.buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelInput1: '',
      modelInput2: '',
      modelInput3: '',
      modelInput4: '',
      item: {
        title: 'Заголовок формы',
        buttonText: 'Отправить заявку',
        redirectLink: 'google.com',
        inputs: {
          input1: 'Имя',
          input2: 'Фамилия',
          input3: 'Email',
          input4: 'Город'
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('fullScreenToggle', 'add')
  },
  methods: {
    submitForm () {
      alert('Типа отправка формы')
    }
  }
}
</script>
