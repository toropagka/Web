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
      this.$emit('assigments-click', user)
    }
  }
}
</script>
