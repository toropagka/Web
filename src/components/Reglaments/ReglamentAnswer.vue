<template>
  <BoardModalBoxDelete
    v-if="showDeleteAnswer"
    title="Удалить ответ"
    text="Вы действительно хотите удалить ответ?"
    @cancel="showDeleteAnswer = false"
    @yes="deleteAnswer"
  />
  <div
    class="bg-[#F4F5F7] rounded-[6px] min-h-[81px] min-w-[550px] ml-1"
    :class="{ 'bg-[#e8faee]': ((rightAnswer || answer.is_right) && isEditing), 'bg-slate-200': selected, 'cursor-pointer': !isEditing }"
    @click="onSelectAnswer"
  >
    <div
      :id="answer.uid + 'input'"
      :ref="answer.uid + 'input'"
      :placeholder="answerPlaceholder(answer)"
      spellcheck="false"
      class="font-[500] text-[14px] text-[#4C4C4D] leading-[25px] font-['Roboto'] px-4 pt-4 min-h-[60px] break-words"
      :class="{'cursor-editing': isEditing, 'invalid': answer.invalid }"
      :contenteditable="isEditing"
      @blur="false"
      @input="maxAnswerLength"
      @keyup="false"
      @keydown.enter.exact.prevent="$emit('addAnswer')"
      @focusout="updateAnswerName"
      v-text="answer.name"
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
  <div
    v-if="isEditing"
    class="flex justify-between w-[550px] mb-4"
  >
    <div
      v-if="!answer.is_right"
      class="bg-[#E3F4E8] cursor-pointer flex flex-row mt-2 items-center px-2 py-1 rounded-[6px] ml-1 hover:transition hover:opacity-[0.8]"
      @click="setRightAnswer(true)"
    >
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.3346 1L5.0013 8.33333L1.66797 5"
          stroke="#7E7E80"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="ml-2 text-[12px] font-[400] font-roboto text-[#4C4C4D]">Отметить как правильный</span>
    </div>
    <div
      v-if="answer.is_right"
      class="bg-[#FFEDED] cursor-pointer flex flex-row mt-2 items-center px-2 py-1 rounded-[6px] ml-1 hover:transition hover:opacity-[0.8]"
      @click="setRightAnswer(false)"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.17387 7.99929L12.7537 4.42723C12.9105 4.27044 12.9986 4.05779 12.9986 3.83605C12.9986 3.61432 12.9105 3.40167 12.7537 3.24487C12.597 3.08808 12.3843 3 12.1626 3C11.9409 3 11.7283 3.08808 11.5715 3.24487L8 6.82526L4.42845 3.24487C4.27168 3.08808 4.05906 3 3.83736 3C3.61565 3 3.40303 3.08808 3.24626 3.24487C3.08949 3.40167 3.00142 3.61432 3.00142 3.83605C3.00142 4.05779 3.08949 4.27044 3.24626 4.42723L6.82613 7.99929L3.24626 11.5713C3.16823 11.6488 3.10629 11.7408 3.06403 11.8423C3.02176 11.9438 3 12.0526 3 12.1625C3 12.2724 3.02176 12.3813 3.06403 12.4827C3.10629 12.5842 3.16823 12.6763 3.24626 12.7537C3.32365 12.8317 3.41573 12.8937 3.51718 12.936C3.61864 12.9782 3.72745 13 3.83736 13C3.94726 13 4.05608 12.9782 4.15753 12.936C4.25898 12.8937 4.35106 12.8317 4.42845 12.7537L8 9.17332L11.5715 12.7537C11.6489 12.8317 11.741 12.8937 11.8425 12.936C11.9439 12.9782 12.0527 13 12.1626 13C12.2725 13 12.3814 12.9782 12.4828 12.936C12.5843 12.8937 12.6763 12.8317 12.7537 12.7537C12.8318 12.6763 12.8937 12.5842 12.936 12.4827C12.9782 12.3813 13 12.2724 13 12.1625C13 12.0526 12.9782 11.9438 12.936 11.8423C12.8937 11.7408 12.8318 11.6488 12.7537 11.5713L9.17387 7.99929Z"
          fill="#4C4C4D"
        />
      </svg>

      <span class="ml-2 text-[12px] font-[400] font-roboto text-[#4C4C4D]">Cбросить</span>
    </div>
    <div
      v-if="isEditing"
      class="flex flex-row items-center cursor-pointer mr-1 mt-2 hover:transition hover:opacity-[0.8]"
      @click="deleteAnswer()"
    >
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.92308 2.64286H8.07692C8.07692 2.3587 7.96346 2.08617 7.7615 1.88524C7.55954 1.68431 7.28562 1.57143 7 1.57143C6.71438 1.57143 6.44046 1.68431 6.2385 1.88524C6.03654 2.08617 5.92308 2.3587 5.92308 2.64286ZM4.84615 2.64286C4.84615 2.07454 5.07308 1.52949 5.477 1.12763C5.88093 0.725765 6.42876 0.5 7 0.5C7.57124 0.5 8.11907 0.725765 8.523 1.12763C8.92692 1.52949 9.15385 2.07454 9.15385 2.64286H13.4615C13.6043 2.64286 13.7413 2.6993 13.8423 2.79976C13.9433 2.90023 14 3.03649 14 3.17857C14 3.32065 13.9433 3.45691 13.8423 3.55738C13.7413 3.65784 13.6043 3.71429 13.4615 3.71429H12.8542L11.5565 13.1836C11.4684 13.8253 11.1497 14.4135 10.6593 14.8394C10.1688 15.2653 9.5399 15.5 8.88892 15.5H5.11108C4.4601 15.5 3.83116 15.2653 3.34072 14.8394C2.85028 14.4135 2.53155 13.8253 2.44354 13.1836L1.14585 3.71429H0.538462C0.395653 3.71429 0.258693 3.65784 0.157712 3.55738C0.0567306 3.45691 0 3.32065 0 3.17857C0 3.03649 0.0567306 2.90023 0.157712 2.79976C0.258693 2.6993 0.395653 2.64286 0.538462 2.64286H4.84615ZM5.92308 6.39286C5.92308 6.25078 5.86635 6.11452 5.76537 6.01405C5.66438 5.91358 5.52742 5.85714 5.38462 5.85714C5.24181 5.85714 5.10485 5.91358 5.00387 6.01405C4.90288 6.11452 4.84615 6.25078 4.84615 6.39286V11.75C4.84615 11.8921 4.90288 12.0283 5.00387 12.1288C5.10485 12.2293 5.24181 12.2857 5.38462 12.2857C5.52742 12.2857 5.66438 12.2293 5.76537 12.1288C5.86635 12.0283 5.92308 11.8921 5.92308 11.75V6.39286ZM8.61539 5.85714C8.75819 5.85714 8.89515 5.91358 8.99614 6.01405C9.09712 6.11452 9.15385 6.25078 9.15385 6.39286V11.75C9.15385 11.8921 9.09712 12.0283 8.99614 12.1288C8.89515 12.2293 8.75819 12.2857 8.61539 12.2857C8.47258 12.2857 8.33562 12.2293 8.23463 12.1288C8.13365 12.0283 8.07692 11.8921 8.07692 11.75V6.39286C8.07692 6.25078 8.13365 6.11452 8.23463 6.01405C8.33562 5.91358 8.47258 5.85714 8.61539 5.85714ZM3.51077 13.0389C3.56362 13.4239 3.75485 13.7768 4.04906 14.0322C4.34328 14.2877 4.72056 14.4285 5.11108 14.4286H8.88892C9.27963 14.4288 9.65717 14.2881 9.95161 14.0326C10.246 13.7771 10.4374 13.4241 10.4903 13.0389L11.7675 3.71429H2.23246L3.51077 13.0389Z"
          fill="#7E7E80"
        />
      </svg>
      <span class="ml-[5px] text-[12px] font-[400] text-[#4C4C4D] font-roboto">
        Удалить
      </span>
    </div>
  </div>
</template>

<script>
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
export default {
  components: {
    BoardModalBoxDelete
  },
  props: {
    answer: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addAnswer', 'deleteAnswer', 'setRightAnswer', 'onSelectAnswer', 'resetRightAnswer', 'updateAnswerName'],
  expose: ['onFocus'],
  data () {
    return {
      name: '',
      showDeleteAnswer: false,
      rightAnswer: false
    }
  },
  computed: {
    selected () {
      return this.answer.selected
    }
  },
  methods: {
    answerPlaceholder (answer) {
      if (answer.name === '' && answer.invalid) {
        return 'Поле ответа не должно быть пустым'
      }
      return this.isEditing ? 'Текст ответа' : ''
    },
    maxAnswerLength () {
      const maxLength = 280
      const answerInput = document.getElementById(this.answer.uid + 'input')
      if (answerInput.innerHTML.length > maxLength) {
        answerInput.innerHTML = answerInput.innerHTML.substr(0, maxLength)
        answerInput.blur()
      }
    },
    deleteAnswer () {
      this.showDeleteAnswer = false
      this.$emit('deleteAnswer', this.answer.uid)
    },
    onSelectAnswer () {
      if (this.isEditing) return
      this.$emit('onSelectAnswer', this.answer.uid)
    },
    setRightAnswer (val) {
      this.rightAnswer = val
      this.$emit('setRightAnswer', [this.answer, val])
    },
    resetRightAnswer () {
      this.rightAnswer = false
    },
    updateAnswerName (event) {
      this.$emit('updateAnswerName', [event.target.innerText, this.answer])
    },
    onFocus () {
      this.$refs[this.answer.uid + 'input'].focus()
      const range = document.createRange()
      const sel = document.getSelection()
      range.setStart(this.$refs[this.answer.uid + 'input'], 0)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}
</script>

<style scoped>
[placeholder]:empty::before {
    content: attr(placeholder);
    color: #555;
}
.invalid[placeholder]:empty::before {
    color: rgb(239 68 68);
}
</style>
