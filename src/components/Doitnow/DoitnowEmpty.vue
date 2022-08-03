<template>
  <div>
    <div class="max-w-xl mx-auto">
      <img
        class="mx-auto mt-10"
        width="320"
        height="314"
        src="@/assets/images/emptydoitnow.png"
        alt="Empty task image"
      >
      <div
        v-if="displayModal"
        class="flex flex-col"
      >
        <p class="font-bold p-3">
          Не отвлекайтесь на другие задачи, а работайте только с одной конкретной задачей
        </p>
        <p class="text-sm p-3">
          Очередь позволит вам работать и в конце концов выполнить конкретную задачу или поручение. Вы не знаете, какая задача будет следующей, а следовательно не думаете о ней, и выполняете только ту, которая сейчас у вас перед глазами.
        </p>
        <p class="text-sm p-3">
          Вам больше не нужно постоянно переключаться между разделами, чтобы разобрать новые сообщения от команды, решать, что делать с просроченными задачами и не забыть про задачи на сегодня.
        </p>
        <button
          class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
          @click="okToModal"
        >
          Понятно
        </button>
      </div>
      <div
        v-if="!displayModal"
      >
        <p
          class="text-xl text-center font-bold mt-[17px]"
        >
          Отличная работа! В Очереди пусто.<br>
          Запланируем еще дела?
        </p>
        <div class="grid grid-cols-1">
          <button
            class="bg-[#FF912380] px-2 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3] w-[156px] h-[51px] mr-auto ml-auto mt-[35px]"
            @click="goToday"
          >
            Запланировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as TASK from '@/store/actions/tasks'
export default {
  emits: ['clickPlanning'],
  data () {
    return {
      displayModal: false
    }
  },
  mounted () {
    if (this.$store.state.user.visitedModals.includes('doitnow')) {
      return
    }
    this.displayModal = this.$store.state.user.showModals
  },
  methods: {
    goToday: function () {
      this.$store.dispatch(TASK.TASKS_REQUEST)
      const navElem = {
        name: 'Сегодня',
        key: 'taskListSource',
        value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: new Date() },
        typeVal: new Date(),
        type: 'date'
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: '901841d9-0016-491d-ad66-8ee42d2b496b', param: null } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
    },
    okToModal () {
      this.displayModal = false
      this.$store.state.user.visitedModals.push('doitnow')
    }
  }
}
</script>

<style scoped></style>
