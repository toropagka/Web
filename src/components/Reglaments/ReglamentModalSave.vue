<template>
  <ModalBox
    ok="Сохранить"
    title="Сохранение регламента"
    class="flex-col w-[100px]"
    @ok="onSave"
    @cancel="close"
  >
    <div class="flex flex-col">
      <div
        class="flex gap-[10px] items-center cursor-pointer"
        @click="toggleEmployes"
      >
        <svg
          v-if="isClear"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 5C0 2.23858 2.23858 0 5 0H15C17.7614 0 20 2.23858 20 5V15C20 17.7614 17.7614 20 15 20H5C2.23858 20 0 17.7614 0 15V5Z"
            fill="#FF9123"
          />
          <path
            d="M9.02899 14.1663C8.80147 14.1663 8.57397 14.0661 8.34645 13.9659L4.59245 11.46C4.13742 11.1593 4.02366 10.4577 4.36494 10.0567C4.70621 9.65579 5.50251 9.55555 5.95754 9.85626L8.91524 11.7607L14.7169 6.14759C15.1719 5.74665 15.8545 5.74665 16.3095 6.04735C16.7645 6.44829 16.7645 7.0497 16.4232 7.45064L9.93905 13.6652C9.71154 14.0661 9.37026 14.1663 9.02899 14.1663Z"
            fill="white"
          />
        </svg>
        <svg
          v-else
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="20"
            height="20"
            rx="4"
            fill="#EEEFF1"
          />
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="19"
            rx="3.5"
            stroke="black"
            stroke-opacity="0.1"
          />
        </svg>
        <div class="font-roboto text-[14px] leading-[20px] text-[#4c4c4d] cursor-pointer">
          Очистить сотрудников прошедших регламент
        </div>
      </div>
      <h2 class="mt-4 text-[14px]">
        Добавить комментарий к изменениям
      </h2>
      <div
        class="bg-[#F4F5F7] rounded-[6px] min-h-[81px] ml-1 mt-2 max-w-[300px]"
      >
        <div
          :id="23426 + 'input'"
          :ref="432532 + 'input'"
          :placeholder="'123'"
          spellcheck="false"
          class="font-[500] text-[14px] px-4 pt-4 leading-6 min-h-[60px] break-words"
          :contenteditable="true"
          @blur="false"
          @input="50"
          @keyup="false"
          v-text="note"
        />
        <div class="flex justify-end items-end pb-2 pr-2">
          <svg
            class="right-0"
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.5294 1.52941L1.5294 9.52935L0.46875 8.46869L8.46875 0.46875L9.5294 1.52941ZM10.5294 5.52935L5.52941 10.5294L4.46875 9.46869L9.46875 4.46869L10.5294 5.52935Z"
              fill="#8C8CA2"
            />
          </svg>
        </div>
      </div>
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'
export default {
  components: {
    ModalBox
  },
  emits: ['onSave', 'close'],
  data () {
    return {
      note: '',
      isClear: false
    }
  },
  methods: {
    onSave () {
      this.$emit('onSave')
    },
    close () {
      this.$emit('close')
    },
    toggleEmployes () {
      this.isClear = !this.isClear
    }
  }
}
</script>
