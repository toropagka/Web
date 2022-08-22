<template>
  <div>
    <div class="w-full sticky top-[45px] left-0 right-0 z-[6]">
      <div class="top-0 bg-[#f4f5f7] pt-[5px] pb-[15px]">
        <div
          class="flex justify-end gap-[8px] mr-3"
        >
          <PopMenu v-if="!editorsCanEdit">
            <ReglamentSmallButton>
              Добавить редактора
            </ReglamentSmallButton>
            <template #menu>
              <div class="max-h-[220px] overflow-y-auto scroll-style max-w-[260px]">
                <BoardPropsMenuItemUser
                  v-for="editor in usersCanAddToAccess"
                  :key="editor.email"
                  :show-check-mark="checkEditor(editor.email)"
                  :user-email="editor.email"
                  @click="addReglamentEditor(editor.email)"
                />
              </div>
            </template>
          </PopMenu>
          <PopMenu>
            <ReglamentSmallButton>
              {{ currDepTitle }}
            </ReglamentSmallButton>
            <template #menu>
              <div class="max-h-[220px] overflow-y-auto scroll-style max-w-[260px]">
                <PopMenuItem
                  @click="currDep = ''"
                >
                  Общий для всех отделов
                </PopMenuItem>
                <PopMenuItem
                  v-for="dep in allDepartments"
                  :key="dep.uid"
                  @click="currDep = dep.uid"
                >
                  {{ dep.name }}
                </PopMenuItem>
              </div>
            </template>
          </PopMenu>
          <ReglamentSmallButton
            :icon="shouldClear ? 'check' : 'uncheck'"
            @click="shouldClear = !shouldClear"
          >
            Очистить сотрудников, прошедших регламент
          </ReglamentSmallButton>
          <ReglamentSmallButton
            class="w-[224px]"
            icon="edit"
            @click="onSaveReglamentButtonClick"
          >
            {{ saveButtonText }}
          </ReglamentSmallButton>
          <ReglamentSmallButton
            class="w-[224px]"
            icon="edit"
            @click="setEdit"
          >
            {{ editButtonText }}
          </ReglamentSmallButton>
        </div>
      </div>
    </div>
    <div
      class="bg-white p-3 rounded mb-3"
    >
      <input
        v-model="currName"
        type="text"
        placeholder="Наименование"
        class="p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      >
    </div>
    <QuillEditor
      v-model:content="currText"
      content-type="html"
      :toolbar="'full'"
      class="h-auto mb-5 bg-white"
      @paste="pasteEvent"
    />
    <div
      class="flex font-['Roboto'] text-[#7E7E80] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[13px] font-medium"
    >
      В тесте будут представлены следующие вопросы:
    </div>
  </div>
  <div>
    <template
      v-for="(question , index) in questions"
      :key="index"
    >
      <ReglamentQuestion
        :ref="question.uid"
        :is-editing="true"
        :question="question"
        :reglament="reglament"
        @deleteQuestion="onDeleteQuestion"
        @deleteAnswer="deleteAnswer"
        @addQuestion="onAddQuestion"
        @updateQuestionName="updateQuestionName"
        @updateAnswerName="updateAnswerName"
        @pushAnswer="pushAnswer"
        @selectAnswer="selectAnswer"
        @setRightAnswer="setRightAnswer"
      />
    </template>
  </div>
  <ListBlocAdd
    v-if="canEdit"
    class="mt-5 w-full mb-5"
    @click.stop="onAddQuestion"
  />
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'

import ReglamentSmallButton from '@/components/Reglaments/ReglamentSmallButton.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import BoardPropsMenuItemUser from '@/components/Board/BoardPropsMenuItemUser.vue'
import ReglamentQuestion from '@/components/Reglaments/ReglamentQuestion'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import * as REGLAMENTS from '@/store/actions/reglaments'
import * as QUESTIONS from '@/store/actions/reglament_questions'
import * as ANSWER from '@/store/actions/reglament_answers'

export default {
  components: {
    QuillEditor,
    ReglamentSmallButton,
    PopMenu,
    PopMenuItem,
    BoardPropsMenuItemUser,
    ReglamentQuestion,
    ListBlocAdd
  },
  props: {
    reglament: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['exitEditMode'],
  data () {
    return {
      currEditors: [],
      currName: '',
      currDep: '',
      currText: this.$store.state.reglaments.reglaments[this.reglament?.uid].content ?? '',
      saveContentStatus: 1, // 1 - is saved, 2 error, 0 request processing
      buttonSaveReglament: 1, // то же самое что и saveContentStatus, сделано для того, чтобы 2 кнопки не принимали 1 статус
      shouldClear: false,
      isFormInvalid: false
    }
  },
  computed: {
    allDepartments () {
      const deps = Object.values(this.$store.state.departments.deps)
      deps.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.name > item2.name) return 1
        if (item1.name < item2.name) return -1
        return 0
      })
      if (this.showAllReglaments) return deps
      const currentUserEmail = this.$store.state.user.user.current_user_email.toLowerCase()
      return deps.filter(dep => dep.emails.find(email => email.toLowerCase() === currentUserEmail))
    },
    user () {
      return this.$store.state.user.user
    },
    questions () {
      return this.$store?.state?.reglaments?.reglamentQuestions
    },
    currReglament () {
      return this.$store.state.reglaments.reglaments[this.reglament?.uid]
    },
    editorsCanEdit () {
      return this.currReglament?.editors?.includes(this.$store.state.user.user.current_user_email)
    },
    canEdit () {
      return (this.currReglament?.email_creator === this.user.current_user_email) || (this.editorsCanEdit) || (this.userType === 2 || this.userType === 1)
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
    currDepTitle () {
      const dep = this.$store.state.departments.deps[this.currDep]
      return dep?.name || 'Общий для всех отделов'
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      const creator = this.reglamentCreatorEmail.toLowerCase()
      for (const emp of employees) {
        if (emp.email.toLowerCase() !== creator) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
    },
    editButtonText () {
      if (this.saveContentStatus === 1) {
        return 'Завершить редактирование'
      } else if (this.saveContentStatus === 2) {
        return 'Ошибка сохранения регламента'
      } else if (this.saveContentStatus === 0) {
        return 'Сохраняется'
      }
      return 'Сохраняется'
    },
    saveButtonText () {
      if (this.buttonSaveReglament === 1) {
        return 'Сохранить'
      } else if (this.buttonSaveReglament === 2) {
        return 'Ошибка сохранения регламента'
      } else if (this.buttonSaveReglament === 0) {
        return 'Сохраняется'
      }
      return 'Сохраняется'
    }
  },
  mounted () {
    this.currName = this.reglamentTitle
    this.currEditors = [...this.reglamentEditors]
    this.currDep = this.reglamentDep
  },
  methods: {
    onDeleteQuestion (uid) {
      this.$store.commit(REGLAMENTS.REGLAMENT_DELETE_QUESTION, uid)
    },
    deleteAnswer (uid) {
      this.$store.commit(REGLAMENTS.REGLAMENT_DELETE_ANSWER, uid)
    },
    pushAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_PUSH_ANSWER, data)
    },
    updateAnswerName (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_UPDATE_ANSWER_NAME, data)
    },
    selectAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SELECT_ANSWER, data)
    },
    setRightAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SET_RIGHT_ANSWER, data)
    },
    updateQuestionName (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_UPDATE_QUESTION_NAME, data)
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    gotoNode (uid) {
      this.$refs[uid][0].onFocus()
    },
    onAddQuestion () {
      const question = {
        uid: this.uuidv4(),
        name: '',
        uid_reglament: this.currReglament.uid
      }
      const answer = {
        uid: this.uuidv4(),
        uid_question: question.uid,
        name: '',
        is_right: 0,
        needToCreate: true,
        needToUpdate: false
      }

      const questionToPush = {
        uid: question.uid,
        name: question.name,
        uid_reglament: question.uid_reglament,
        needToCreate: true,
        needToUpdate: false,
        answers: [answer]
      }
      this.$store.commit(REGLAMENTS.REGLAMENT_PUSH_QUESTION, questionToPush)
      this.$nextTick(() => {
        this.gotoNode(questionToPush.uid)
      })
    },
    addReglamentEditor (email) {
      const index = this.currEditors.findIndex(editor => editor.toLowerCase() === email.toLowerCase())
      if (index !== -1) {
        this.currEditors.splice(index, 1)
      } else {
        this.currEditors.push(email)
      }
    },
    checkEditor (email) {
      return this.currEditors.includes(email)
    },
    saveReglament (reglament) {
      if (!reglament.name.length) {
        reglament.name = 'Регламент без названия'
      }

      for (const question of this.questions) {
        if (question.needToCreate || question.needToUpdate) {
          const questionData = {
            name: question.name,
            uid: question.uid,
            uid_reglament: question.uid_reglament
          }
          Promise.resolve().then(() => {
            if (question.needToCreate) {
              return this.$store.dispatch(QUESTIONS.CREATE_REGLAMENT_QUESTION_REQUEST, questionData)
            } else if (question.needToUpdate) {
              return this.$store.dispatch(QUESTIONS.UPDATE_REGLAMENT_QUESTION_REQUEST, questionData)
            }
          })
            .then(() => {
              question.needToCreate = false
              question.needToUpdate = false
            })
        }

        for (const answer of question.answers) {
          if (answer.needToCreate || answer.needToUpdate) {
            const answerData = {
              uid: answer.uid,
              uid_question: answer.uid_question,
              name: answer.name,
              is_right: answer.is_right
            }

            Promise.resolve().then(() => {
              if (answer.needToCreate) {
                return this.$store.dispatch(ANSWER.CREATE_REGLAMENT_ANSWER_REQUEST, answerData)
              } else if (answer.needToUpdate) {
                return this.$store.dispatch(ANSWER.UPDATE_REGLAMENT_ANSWER_REQUEST, answerData)
              }
            })
              .then(() => {
                answer.needToCreate = false
                answer.needToUpdate = false
              })
          }
        }
      }

      this.$store.state.reglaments.answersToDelete.forEach((uid, index) => {
        this.$store.dispatch(ANSWER.DELETE_REGLAMENT_ANSWER_REQUEST, uid).then(() => {
          this.$store.state.reglaments.answersToDelete.splice(index, 1)
        })
      })

      this.$store.state.reglaments.questionsToDelete.forEach((uid, index) => {
        this.$store.dispatch(QUESTIONS.DELETE_REGLAMENT_QUESTION_REQUEST, uid).then(() => {
          this.$store.state.reglaments.questionsToDelete.splice(index, 1)
        })
      })

      return this.$store.dispatch(REGLAMENTS.UPDATE_REGLAMENT_REQUEST, reglament)
    },
    setEdit () {
      const reglament = { ...this.currReglament }
      reglament.content = this.currText
      reglament.name = this.currName.trim()
      reglament.department_uid = this.currDep
      reglament.editors = [...this.currEditors]

      this.saveContentStatus = 0
      this.isFormInvalid = false
      this.firstInvalidQuestionUid = null
      this.validateReglamentQuestions()
      if (this.isFormInvalid && this.firstInvalidQuestionUid) {
        this.gotoNode(this.firstInvalidQuestionUid)
        return
      }

      this.saveReglament(reglament).then(() => {
        if (this.shouldClear) {
          this.$store.dispatch(REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS, reglament.uid)
          this.shouldClear = false
        }
        this.saveContentStatus = 1
        // обновляем регламент в сторе
        // надо бы сделать по нормальному через мутацию
        const reglaments = this.$store.state.navigator.navigator.reglaments
        const index = reglaments.items.findIndex(item => item.uid === reglament.uid)
        if (index !== -1) reglaments.items[index] = reglament
        this.$emit('exitEditMode')
      }).catch(() => {
        this.saveContentStatus = 2
      })
    },
    validateReglamentQuestions () {
      for (const question of this.questions) {
        question.invalid = question.name === ''

        if (!this.isFormInvalid && question.name === '') {
          this.isFormInvalid = true
          this.firstInvalidQuestionUid = question.uid
        }

        for (const answer of question.answers) {
          answer.invalid = answer.name === ''

          if (!this.isFormInvalid && answer.name === '') {
            this.isFormInvalid = true
            this.firstInvalidQuestionUid = question.uid
          }
        }
      }
    },
    onSaveReglamentButtonClick () {
      const reglament = { ...this.currReglament }
      reglament.content = this.currText
      reglament.name = this.currName.trim()
      reglament.department_uid = this.currDep
      reglament.editors = [...this.currEditors]

      this.isFormInvalid = false
      this.firstInvalidQuestionUid = null
      this.validateReglamentQuestions()
      if (this.isFormInvalid && this.firstInvalidQuestionUid) {
        this.gotoNode(this.firstInvalidQuestionUid)
        return
      }

      this.buttonSaveReglament = 0
      this.saveReglament(reglament).then(() => {
        if (this.shouldClear) {
          this.$store.dispatch(REGLAMENTS.DELETE_USERS_REGLAMENT_ANSWERS, reglament.uid)
          this.shouldClear = false
        }
        this.buttonSaveReglament = 1
        // обновляем регламент в сторе
        // надо бы сделать по нормальному через мутацию
        const reglaments = this.$store.state.navigator.navigator.reglaments
        const index = reglaments.items.findIndex(item => item.uid === reglament.uid)
        if (index !== -1) reglaments.items[index] = reglament
      }).catch(() => {
        this.buttonSaveReglament = 2
      })
    },
    pasteEvent (e) {
      const node = e.target.parentNode.classList.contains('ql-editor') ? e.target : e.target.parentNode
      setTimeout(() => {
        node.scrollIntoView({ block: 'center' })
      }, 1)
    }
  }
}
</script>
