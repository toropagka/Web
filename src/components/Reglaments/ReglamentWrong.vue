<template>
  <div
    v-if="showQuestion"
    class="bg-[#F4F5F7] p-3 rounded-[10px] mb-[10px]"
  >
    <div class="px-1 flex justify-between items-center group">
      <div class="font-[400] text-[16px] font-[#4C4C4D] my-3 min-w-[10px] min-h-[10px]">
        {{ question.name }}
      </div>
    </div>
    <div
      v-if="correctAnswers.length"
      class="font-[400] text-[16px] my-1 min-w-[10px] min-h-[10px] px-1"
    >
      Правильные ответы:
      <ul>
        <li
          v-for="correctAnswer in correctAnswers"
          :key="correctAnswer.id"
        >
          {{ correctAnswer.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    question: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      correctAnswers: []
    }
  },
  computed: {
    showQuestion () {
      // правильные ответы
      const creatorAnswers = []
      // ответы пользователя
      const userAnswers = []
      let shouldShow = creatorAnswers.length
      for (let i = 0; i < this.question.answers.length; i++) {
        if (this.question.answers[i].is_right) {
          creatorAnswers.push(this.question.answers[i])
        }
        if (this.question.answers[i].selected) {
          userAnswers.push(this.question.answers[i])
        }
      }
      // проверяем совпадают ли элементы в массивах
      if (userAnswers.length === 0) {
        shouldShow = true
        return shouldShow
      }
      // Если в вопросе больше одного ответа
      if (creatorAnswers.length > 1) {
        shouldShow = this.checkMultiQuestion(creatorAnswers, userAnswers)
        return shouldShow
      }
      for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i]?.uid === creatorAnswers[i]?.uid) {
          shouldShow = false
        } else {
          shouldShow = true
          return shouldShow
        }
      }
      return shouldShow
    }
  },
  methods: {
    checkMultiQuestion (creatorAnswers, userAnswers) {
      const correctUserAnswers = userAnswers.filter((answer) => creatorAnswers.includes(answer))
      const correctAnswersDifference = creatorAnswers.filter((answer) => !correctUserAnswers.includes(answer))
      if (creatorAnswers.length === userAnswers.length && correctAnswersDifference.length === 0) {
        return false
      }
      const incorrectAnswersDifference = creatorAnswers.filter((answer) => correctUserAnswers.includes(answer))
      this.correctAnswers = incorrectAnswersDifference.map((answer) => { return { id: answer.id, name: answer.name } })
      return true
    }
  }
}
</script>
<style scoped></style>
