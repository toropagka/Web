<template>
  <div class="w-full">
    <div class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold mb-2">
      Клиенты
    </div>
    <ModalBoxAddClient
      v-if="showModalBoxAddClient"
      :show="showModalBoxAddClient"
      title="Добавления клиента"
      ok="Добавить"
      @ok="AddClient"
      @cancel="showModalBoxAddClient = false"
    >
      <div class="flex flex-col w-full">
        <div>
          <p class="mb-[10px] mt-[10px]">
            Имя
          </p>
          <input
            v-model="NameClient"
            type="text"
            style=""
            autocomplete=""
            class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          >
        </div>
        <div>
          <p class="mb-[10px] mt-[10px]">
            Фамилия
          </p>
          <input
            v-model="NameClient"
            type="text"
            style=""
            autocomplete=""
            class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          >
        </div>
        <div>
          <p class="mb-[10px] mt-[10px]">
            E-mail
          </p>
          <input
            v-model="NameClient"
            type="text"
            style=""
            autocomplete=""
            class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          >
        </div>
        <div>
          <p class="mb-[10px] mt-[10px]">
            Номер телефона
          </p>
          <input
            v-model="NameClient"
            type="text"
            style=""
            autocomplete=""
            class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          >
        </div>
      </div>
    </ModalBoxAddClient>
    <ClientCard
      v-for="client in clients"
      :key="client.uid"
      class="mb-2"
      :client="client"
    />
    <ListBlocAdd
      class="mt-2"
      @click.stop="clickAddClient"
    />
  </div>
</template>
<script>
import ClientCard from '@/components/Clients/ClientCard.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ModalBoxAddClient from '@/components/Clients/ModalBoxAddClient.vue'

export default {
  components: {
    ModalBoxAddClient,
    ClientCard,
    ListBlocAdd
  },
  data () {
    return {
      showModalBoxAddClient: false
    }
  },
  computed: {
    clients () {
      return this.$store.state.clients.clients
    }
  },
  methods: {
    clickAddClient () {
      this.showModalBoxAddClient = true
    }
  }
}
</script>
<style scoped></style>
