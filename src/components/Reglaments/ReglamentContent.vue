<template>
  <ReglamentTestLimit
    v-if="showTestLimit"
    @cancel="showTestLimit = false"
    @ok="showTestLimit = false"
  />
  <ReglamentEditLimit
    v-if="showEditLimit"
    @cancel="showEditLimit = false"
    @ok="showEditLimit = false"
  />
  <ReglamentContentEditor
    v-if="isEditing"
    :reglament="reglament"
    @exitEditMode="isEditing = false"
  />
  <div v-else>
    <div
      class="flex justify-end mb-2 h-[30px]"
    >
      <ReglamentSmallButton
        v-if="canEdit && !showCompleteMessage && !isTesting"
        class="w-[224px]"
        icon="edit"
        @click="setEdit"
      >
        Редактировать
      </ReglamentSmallButton>
      <div class="rounded-[6px] hover:bg-[#f4f5f7] bg-white flex justify-center items-center ml-[8px] px-[5px]">
        <NavBarButtonsReglament
          :reglament-uid="reglament.uid"
        />
      </div>
    </div>
    <ReglamentInfo
      v-if="!isTesting"
      :title="reglamentTitle"
      :creator="reglamentCreatorEmail"
      :editors="reglamentEditors"
      :contributors="contributors"
      :department="reglamentDep"
    />
    <QuillEditor
      v-if="reglamentContent.length && !isTesting"
      v-model:content="reglamentContent"
      content-type="html"
      :read-only="true"
      :toolbar="['']"
      class="h-auto mb-5 bg-white"
    />
    <div
      v-if="(isTesting || isEditing) && !showCompleteMessage"
    >
      <template
        v-for="(question , index) in questions"
        :key="index"
      >
        <ReglamentQuestion
          :ref="question.uid"
          :question="question"
          :reglament="reglament"
          @selectAnswer="selectAnswer"
        />
      </template>
    </div>
  </div>

  <div
    v-if="!isEditing && !isTesting && questions.length > 0 && !isContributor && shouldShowButton"
    class="flex justify-end"
  >
    <button
      class="flex items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      @click="startTheReglament"
    >
      Пройти тест
    </button>
  </div>
  <div
    v-if="!isEditing && isTesting && questions.length > 0 && !showCompleteMessage"
    class="flex justify-end"
  >
    <button
      class="flex min-w-[175px] justify-center items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-black text-sm mr-1 hover:bg-[#F5DEB3]"
      :class="{ 'bg-[#E7E2E1] hover:bg-[#C5C5C5]': disableButton === true }"
      :disabled="disableButton"
      @click="clickComplete"
    >
      {{ completeText }}
    </button>
  </div>
  <div
    v-if="showCompleteMessage && !isPassed"
    class="py-3 rounded-[10px] mb-2 font-[500] text-[20px] my-3 min-w-[10px] min-h-[10px]"
  >
    Вы неправильно ответили на следующие вопросы:
  </div>
  <template
    v-for="question in questions"
    :key="question.uid"
  >
    <ReglamentWrong
      v-if="showCompleteMessage"
      :question="question"
    />
  </template>
  <ReglamentCompleteMessage
    v-if="showCompleteMessage"
    :is-passed="isPassed"
    :name="reglament.name"
    @confirm="confirm"
  />
  <div class="h-[20px]" />
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import * as REGLAMENTS from '@/store/actions/reglaments.js'

import ReglamentWrong from '@/components/Reglaments/ReglamentWrong.vue'
import ReglamentInfo from '@/components/Reglaments/ReglamentInfo.vue'
import ReglamentTestLimit from '@/components/Reglaments/ReglamentTestLimit.vue'
import ReglamentEditLimit from '@/components/Reglaments/ReglamentEditLimit.vue'
import ReglamentQuestion from './ReglamentQuestion.vue'
import ReglamentCompleteMessage from './ReglamentCompleteMessage.vue'
import ReglamentSmallButton from '@/components/Reglaments/ReglamentSmallButton.vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import NavBarButtonsReglament from '@/components/Navbar/NavBarButtonsReglament'

import * as SLIDES from '@/store/actions/slides.js'
import ReglamentContentEditor from '@/components/Reglaments/ReglamentContentEditor'

export default {
  components: {
    ReglamentContentEditor,
    NavBarButtonsReglament,
    QuillEditor,
    ReglamentQuestion,
    ReglamentInfo,
    ReglamentCompleteMessage,
    ReglamentWrong,
    ReglamentSmallButton,
    ReglamentEditLimit,
    ReglamentTestLimit
  },
  props: {
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showTestLimit: false,
      isEditing: false,
      showEditLimit: false,
      isTesting: false,
      showCompleteMessage: false,
      isPassed: 0,
      showCheckMark: false,
      disableButton: false,
      completeText: 'Завершить',
      firstInvalidQuestionUid: null
    }
  },
  computed: {
    currReglament () {
      return this.$store.state.reglaments.reglaments[this.reglament?.uid]
    },
    questions () {
      return this.$store?.state?.reglaments?.reglamentQuestions
    },
    reglamentTitle () {
      return this.currReglament?.name ?? ''
    },
    reglamentContent () {
      return this.currReglament?.content ?? ''
    },
    reglamentCreatorEmail () {
      return this.currReglament?.email_creator ?? ''
    },
    reglamentDep () {
      return this.currReglament?.department_uid ?? ''
    },
    reglamentEditors () {
      return this.currReglament?.editors ?? []
    },
    isContributor () {
      for (let i = 0; i < this.contributors.length; i++) {
        if (this.contributors[i].uid_user === this.user.current_user_uid) {
          return true
        }
      }
      return false
    },
    contributors () {
      return this.$store?.state?.reglaments?.contributors
    },
    needStartEdit () {
      return this.currReglament?.needStartEdit ?? false
    },
    editorsCanEdit () {
      return this.currReglament?.editors?.includes(this.$store.state.user.user.current_user_email)
    },
    userType () {
      return this.$store.state.employees.employees[this.$store.state.user.user.current_user_uid].type
    },
    canEdit () {
      return (this.currReglament?.email_creator === this.user.current_user_email) || (this.editorsCanEdit) || (this.userType === 2 || this.userType === 1)
    },
    user () {
      return this.$store.state.user.user
    },
    shouldShowButton () {
      let hasRightAnswers = false
      for (let i = 0; i < this.questions.length; i++) {
        for (let j = 0; j < this.questions[i].answers.length; j++) {
          if (this.questions[i].answers[j].is_right) {
            hasRightAnswers = true
            return hasRightAnswers
          }
        }
      }
      return hasRightAnswers
    },
    showAllReglaments () {
      return this.$store.state.reglaments.showAll
    }
  },
  watch: {
    isEditing (newval, oldval) {
      if (!newval) {
        setTimeout(() => {
          try {
            document.querySelector('div.ql-toolbar').remove()
          } catch (e) {}
        }, 50)
      } else {
        setTimeout(() => {
          try {
            const toolBar = document.querySelector('div.ql-toolbar')
            toolBar.style.position = 'sticky'
            toolBar.style.top = '95px'
            toolBar.style.zIndex = '5'
            toolBar.style.background = '#f4f5f7'
          } catch (e) {}
        }, 50)
      }
    },
    needStartEdit: {
      immediate: true,
      handler: function (val) {
        if (val) {
          // убираем needStartEdit - чтобы следующий раз не редактировался
          const reglaments = this.$store.state.navigator.navigator.reglaments
          const index = reglaments.items.findIndex(item => item.uid === this.currReglament?.uid)
          if (index !== -1) reglaments.items[index].needStartEdit = false
          //
          this.setEdit()
        }
      }
    }
  },
  mounted () {
    if (!this.currReglament) return
    this.$store.dispatch(REGLAMENTS.REGLAMENT_REQUEST, this.currReglament?.uid)
    this.$store.dispatch(REGLAMENTS.GET_USERS_REGLAMENT_ANSWERS, this.currReglament?.uid)
    try {
      if (!this.isEditing) {
        document.querySelector('div.ql-toolbar').remove()
      }
    } catch (e) {}
  },
  methods: {
    confirm (val) {
      if (this.$store.state.reglaments.returnDoitnow === true) {
        this.$store.state.navigator.lastTab = 'doitnow'
        localStorage.setItem('lastTab', 'doitnow')
        this.$router.push('/doitnow')
        this.$store.state.reglaments.returnDoitnow = false
      }
      if (val) {
        this.$store.dispatch('popNavStack')
        this.$store.dispatch('asidePropertiesToggle', false)
        return
      }
      // обнуляем значения, чтобы юзер ещё раз прочитал регламент
      this.showCompleteMessage = false
      this.isEditing = false
      this.isTesting = false
      // обнуляем значение selected
      this.$store.commit(REGLAMENTS.REGLAMENT_RESTORE_SELECTED)
    },
    selectAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SELECT_ANSWER, data)
    },
    setEdit () {
      if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
        this.showEditLimit = true
        return
      }

      this.isEditing = true
    },
    clickComplete () {
      const data = {
        uid_user: this.user.current_user_uid,
        uid_reglament: this.currReglament.uid,
        answerJson: JSON.stringify(this.questions)
      }
      this.disableButton = true
      this.completeText = 'Завершение...'
      this.$store.dispatch(REGLAMENTS.CRATE_USER_REGLAMENT_ANSWER, data).then((resp) => {
        const reglament = { ...this.currReglament }
        reglament.is_passed = resp.data.is_passed
        this.$store.commit('NAVIGATOR_UPDATE_REGLAMENT', reglament)
        this.showCompleteMessage = true
        this.isPassed = resp.data.is_passed
        this.disableButton = false
        this.completeText = 'Завершить'
        this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'addReglaments', visible: false })
      })
    },
    startTheReglament () {
      if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
        this.showTestLimit = true
        return
      }
      this.isTesting = true
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style>
.ql-snow .ql-tooltip {
  @apply z-30
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "Введите ссылку:";
}
.ql-snow .ql-tooltip[data-mode=video]::before {
  content: "Введите ссылку:";
}
</style>
