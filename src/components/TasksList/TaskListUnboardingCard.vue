<template>
  <div
    class="flex flex-col items-center max-w-[600px] mx-auto"
  >
    <img
      class="mx-auto mt-10"
      width="320"
      height="314"
      src="/img/emptytask2.a127e727.png"
      alt="Empty task image"
    >
    <p class="font-bold p-3">
      Работайте с задачами и поручениями, которые должны быть выполнены сегодня
    </p>
    <p class="text-sm p-3">
      Запишите сюда все ваши рабочие дела и встречи, а также выполняйте поручения
      от коллег, которые ждут от вас результатов сегодня
    </p>
    <button
      class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto my-[20px]"
      @click="onOk"
    >
      Понятно
    </button>
  </div>
</template>

<script>
export default {
  emits: ['ok'],
  methods: {
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>

<style scoped></style>
