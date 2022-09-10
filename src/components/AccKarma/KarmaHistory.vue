<template>
  <div>
    <p class="text-center text-2xl mt-2 font-bold">
      История кармы
    </p>
    <div v-if="!sortedKarmaListByDate.length">
      <p class="text-center text-md text-gray-400 mt-10">
        У Вас еще нет истории :( <br> Завершите инспектируемые задачи
      </p>
    </div>
    <div class="flex flex-col mt-3">
      <div
        v-for="karma in sortedKarmaListByDate"
        :key="karma"
        class="mb-1 rounded-[11px] border-[1px]"
      >
        <KarmaTask
          :karma="karma"
        />
      </div>
    </div>
  </div>
</template>
<script>
import KarmaTask from './KarmaTask.vue'

export default {
  components: { KarmaTask },
  computed: {
    karmaList () {
      return this.$store.state.inspector.karma
    },
    sortedKarmaListByDate () {
      return [...this.karmaList].sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    }
  }

}

</script>
