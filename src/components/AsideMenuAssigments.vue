<template>
  <div
    class="px-[16px]"
  >
    <div v-if="assigments.delegate_iam.items">
      <p class="ml-[10px] my-2 font-roboto text-[13px] leading-[15px] font-medium text-[#606061]">
        {{ assigments.delegate_iam.name }}:
      </p>
      <div
        v-for="iAm in assigments.delegate_iam.items"
        :key="iAm.uid"
        class="ml-[6px] flex items-center h-[40px] flex items-center cursor-pointer hover:bg-white hover:rounded-[10px] px-[10px]"
        @click="goToAssigment(iAm)"
      >
        <div class="h-[30px] w-[30px]">
          <img
            :src="iAm.fotolink"
            :alt="iAm.name"
            height="30"
            width="30"
            class="rounded-[6px] border-2"
            style="border-color: rgb(63, 191, 100);"
          >
        </div>
        <div class="flex-initial ml-[10px] overflow-hidden w-full">
          <p
            class="font-roboto text-[13px] leading-[15px] font-medium truncate"
          >
            {{ iAm.name }}
          </p>
          <p
            class="font-roboto text-[12px] leading-[14px] truncate"
          >
            {{ iAm.email }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="assigments.delegate_to_me.items">
      <p class="ml-[10px] my-2 font-roboto text-[13px] leading-[15px] font-medium text-[#606061]">
        {{ assigments.delegate_to_me.name }}:
      </p>
      <div
        v-for="toMe in assigments.delegate_to_me.items"
        :key="toMe.uid"
        class="ml-[6px] flex items-center h-[40px] flex items-center cursor-pointer hover:bg-white hover:rounded-[10px] px-[10px]"
        @click="goToAssigment(toMe)"
      >
        <div class="h-[30px] w-[30px]">
          <img
            :src="toMe.fotolink"
            :alt="toMe.name"
            height="30"
            width="30"
            class="rounded-[6px] border-2"
            style="border-color: rgb(236, 69, 46);"
          >
        </div>
        <div class="flex-initial ml-[10px] overflow-hidden w-full">
          <p
            class="font-roboto text-[13px] leading-[15px] font-medium truncate"
          >
            {{ toMe.name }}
          </p>
          <p
            class="font-roboto text-[12px] leading-[14px] truncate"
          >
            {{ toMe.email }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UID_TO_ACTION } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'

export default {
  props: {
    assigments: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  methods: {
    goToAssigment (user) {
      const action = UID_TO_ACTION[user.parentID]
      if (!action) {
        console.error('UID_TO_ACTION in undefined', user.parentID)
        return
      }
      this.$store.dispatch(action, user.email)
      const navElem = {
        name: user.name,
        key: 'taskListSource',
        value: { uid: user.parentID, param: user.email }
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'taskListSource', value: { uid: user.parentID, param: user.email } })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    }
  }
}
</script>
