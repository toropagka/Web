<template>
  <div
    class="flex flex-col"
  >
    <img
      class="mx-auto mt-10"
      width="320"
      height="314"
      src="@/assets/images/emptydoitnow.png"
      alt="Empty task image"
    >
    <p class="font-bold p-3">
      Работайте только с одной конкретной задачей и не отвлекайтесь на другие
    </p>
    <ul class="list-decimal pl-[30px]">
      <li class="p-3 text-sm">
        Очередь выдает по одной задаче в один момент времени
      </li>
      <li class="p-3 text-sm">
        У вас нет возможности выбрать задачу и вы не знаете, какая будет следующей
      </li>
      <li class="p-3 text-sm">
        В Очередь попадают непрочитанные и просроченные задачи и поручения, а также поручения и задачи на сегодня
      </li>
    </ul>
    <button
      class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[20px]"
      @click="okToModal"
    >
      Понятно
    </button>
  </div>
</template>
<script>
export default {
  emits: ['okToModal'],
  methods: {
    okToModal () {
      this.$emit('okToModal')
    }
  }
}
</script>
