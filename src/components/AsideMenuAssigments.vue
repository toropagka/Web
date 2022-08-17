<template>
  <div
    class="px-[16px]"
  >
    <template v-for="delegate in assigments">
      <div
        v-if="delegate.items.length"
        :key="delegate.name"
      >
        <p class="ml-[10px] my-2 font-roboto text-[13px] leading-[15px] font-medium text-[#606061]">
          {{ delegate.name }}:
        </p>
        <div
          v-for="item in delegate.items"
          :key="item.uid"
          class="ml-[6px] flex items-center h-[40px] flex items-center cursor-pointer hover:bg-white hover:rounded-[10px] px-[10px]"
          @click="goToAssigment(item)"
        >
          <div>
            <img
              :src="item.fotolink"
              :alt="item.name"
              height="30"
              width="30"
              class="rounded-[6px] border-2"
              :style="[delegate.uid === assigments.delegate_iam.uid ? {'border-color': 'rgb(63, 191, 100)'} : {'border-color': 'rgb(236, 69, 46)'}]"
            >
          </div>
          <div class="flex-initial ml-[10px] overflow-hidden w-full">
            <p
              class="font-roboto text-[13px] leading-[15px] font-medium truncate"
            >
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </template>
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
  emits: ['assigments-click'],
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
      this.$emit('assigments-click', user)
    }
  }
}
</script>
