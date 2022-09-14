<template>
  <div class="w-full">
    <NavBar
      class="pt-[8px]"
      title="Очередь"
    />
    <div
      v-if="!isLoading && !showLimitMessage"
      class="flex justify-between gap-[20px]"
    >
      <transition :name="taskTransition">
        <div class="ml-0 z-[2] grow">
          <DoitnowTask
            v-if="!displayModal && tasksCount && !isLoading && !isNotify && isNotifiesLoaded"
            :key="firstTask.uid"
            :task="firstTask"
            :childrens="childrens"
            :sub-tasks="subTasks"
            :colors="colors"
            :tags="tags"
            :user="user"
            :task-messages="taskMessages.slice().reverse()"
            :employees="employees"
            :projects="projects"
            :tasks-count="tasksCount"
            :is-task-messages-loading="isTaskMessagesLoading"
            @clickTask="onClickTask"
            @nextTask="nextTask"
            @changeValue="changeValue"
            @readTask="readTask"
          />
          <DoitnowNotificationTasks
            v-if="!displayModal && tasksCount && !isLoading && isNotify && isNotifiesLoaded"
            :name="firstTask.name"
            :uid="firstTask.uid"
          />
        </div>
      </transition>
      <!-- если сейчас есть нотифай слайды или приветственные слайды  -->
      <div
        v-if="!displayModal && tasksCount && !isLoading && isNotifiesLoaded && (notifiesCopy.length || slidesCopy.length)"

        class="flex mb-5 justify-end z-[1]"
      >
        <!-- header -->
        <button
          class="py-3 px-4 rounded-lg mr-5 hover:bg-gray-300 text-sm bg-opacity-70 font-medium flex w-[221px] h-[40px] items-center bg-white justify-center"
          @click="nextTask"
        >
          <span class="pr-2">Следующая задача</span>
          <Icon
            :height="arrowForw.height"
            :width="arrowForw.width"
            :box="arrowForw.viewBox"
            :path="arrowForw.path"
          />
        </button>
      </div>
    </div>
    <DoitnowLimit
      v-if="showLimitMessage && !displayModal && !isLoading"
    />
    <DoitnowSkeleton
      v-if="isLoading"
      class="ml-0 pt-[15px] z-[2] grow"
    />
    <DoitnowEmpty
      v-if="(tasksCount === 0 && !isLoading && isNotifiesLoaded && !showLimitMessage) && !displayModal"
      class="ml-0 pt-[15px] z-[2] grow"
    />
    <div
      v-if="displayModal && !isLoading"
      class="max-w-xl mx-auto flex-center flex-col items-center justify-center"
    >
      <DoitnowOnboarding
        @okToModal="okToModal"
      />
    </div>
  </div>
</template>

<script>
import * as FILES from '@/store/actions/taskfiles.js'
import * as MSG from '@/store/actions/taskmessages.js'
import * as TASK from '@/store/actions/tasks.js'

import DoitnowEmpty from '@/components/Doitnow/DoitnowEmpty.vue'
import DoitnowTask from '@/components/Doitnow/DoitnowTask.vue'
import DoitnowSkeleton from '@/components/Doitnow/DoitnowSkeleton.vue'
import NavBar from '@/components/Navbar/NavBar.vue'
import Icon from '@/components/Icon.vue'

import arrowForw from '@/icons/arrow-forw-sm.js'
import { PUSH_COLOR } from '@/store/actions/colors'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import { TASK_STATUS } from '@/constants'

import DoitnowNotificationTasks from './Doitnow/DoitnowNotificationTasks.vue'
import DoitnowLimit from '@/components/Doitnow/DoitnowLimit'
import DoitnowOnboarding from './Doitnow/DoitnowOnboarding.vue'

export default {
  components: {
    DoitnowLimit,
    DoitnowEmpty,
    DoitnowSkeleton,
    DoitnowTask,
    Icon,
    DoitnowNotificationTasks,
    NavBar,
    DoitnowOnboarding
  },
  data () {
    return {
      unreadTasks: [],
      overdueTasks: [],
      todayTasks: [],
      readyTasks: [],
      unreadDelegateByMe: [],
      unreadDelegateToMe: [],
      readyTasksReaded: [],
      readyTasksUnreaded: [],
      openedTasks: [],
      slidesCopy: [],
      projectTasks: [],
      unsortedTasks: [],
      overdueReaded: [],
      notifiesCopy: [],
      tasksLoaded: false,
      childrens: [],
      isTaskMessagesLoading: false,
      arrowForw
    }
  },
  computed: {
    tasksCount () {
      return (
        this.slidesCopy.length +
        this.unreadTasks.length +
        this.overdueTasks.length +
        this.readyTasks.length +
        this.todayTasks.length +
        this.notifiesCopy.length
      )
    },
    firstTask () {
      if (this.slidesCopy.length && this.justRegistered) {
        return this.slidesCopy[0]
      }
      if (this.notifiesCopy.length) {
        return this.notifiesCopy[0]
      }
      if (this.unreadTasks.length) {
        return this.unreadTasks[0]
      }
      if (this.readyTasks.length) {
        return this.readyTasks[0]
      }
      if (this.overdueTasks.length) {
        return this.overdueTasks[0]
      }
      if (this.todayTasks.length) {
        return this.todayTasks[0]
      }
      return null
    },
    slides () {
      return this.$store.state.slides.slides
    },
    taskMessages () {
      return this.$store.state.taskfilesandmessages.messages
    },
    employees () {
      return this.$store.state.employees.employees
    },
    projects () {
      return this.$store.state.projects.projects
    },
    colors () {
      return this.$store.state.colors.colors
    },
    tags () {
      return this.$store.state.tasks.tags
    },
    isLoading () {
      return this.$store.state.tasks.status === 'loading' || !this.isNotifiesLoaded
    },
    isNotifiesLoaded () {
      return this.$store.state.notificationtasks.status === 'success'
    },
    user () {
      return this.$store.state.user.user
    },
    subTasks () {
      return this.$store.state.tasks.subtasks.tasks
    },
    taskTransition () {
      return this.tasksLoaded ? 'slide-in-fade-out' : ''
    },
    displayModal () {
      return !this.$store.state.onboarding?.visitedModals?.includes('doitnow') && this.$store.state.onboarding?.showModals
    },
    notifies () {
      this.setNotifiesCopy(this.$store.state.notificationtasks.notificationtasks)
      return this.$store.state.notificationtasks.notificationtasks
    },
    isNotify () {
      return !!this.firstTask.notify
    },
    justRegistered () {
      return this.$store.state.onboarding.justRegistered
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
    }
  },
  watch: {
    firstTask (newtask) {
      if (newtask && newtask.uid && !this.isNotify) {
        this.isTaskMessagesLoading = true
        this.$store.dispatch(TASK.GET_TASK_CHILDRENS, newtask.uid)
          .then((resp) => {
            this.childrens = resp.data.tasks
          })
        this.$store.commit(TASK.SELECT_TASK, newtask)
        this.$store.dispatch(MSG.MESSAGES_REQUEST, newtask.uid)
          .then(() => {
            this.$store.dispatch(FILES.FILES_REQUEST, newtask.uid)
              .then(() => {
                this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
                  .then(() => {
                    this.$store.commit(FILES.MERGE_FILES_WITH_MESSAGES)
                  }).finally(() => {
                    this.isTaskMessagesLoading = false
                  })
              })
          })
          .catch(() => {
            this.isNextTaskLoading = false
          })
        this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
        this.$store.dispatch(TASK.SUBTASKS_REQUEST, newtask.uid)
      }
    }
  },
  mounted: function () {
    this.$store.dispatch('NOTIFICATION_TASKS_GENERATE').then(() => {
      this.notifiesCopy = [...this.notifies]
    })
    if (this.justRegistered) {
      this.setSlidesCopy()
    }
    if (!this.displayModal) {
      this.loadAllTasks()
    }
    this.$store.dispatch('fullScreenToggle', 'add')
  },
  unmounted: function () {
    this.$store.dispatch('NOTIFICATION_TASKS_CLEAR')
  },
  methods: {
    loadAllTasks: function () {
      this.$store.dispatch(TASK.DOITNOW_TASKS_REQUEST)
        .then((result) => {
          // сортировка непрочитанных
          for (let i = 0; i < result[0].length; i++) {
            // Поручено мной
            if (result[0][i].uid_customer === this.user?.current_user_uid) {
              this.unreadDelegateByMe.unshift(result[0][i])
            } else {
              // Поручено мне
              if (result[0][i].uid_performer === this.user?.current_user_uid) {
                this.unreadDelegateToMe.unshift(result[0][i])
              } else {
                // Готово к сдаче
                if (result[0][i].status === TASK_STATUS.TASK_READY) {
                  this.readyTasksUnreaded.push(result[0][i])
                } else {
                  // Доступ
                  if (result[0][i].emails.includes(this.user?.current_user_email) || (result[0][i].uid_project !== '00000000-0000-0000-0000-000000000000')) {
                    this.openedTasks.push(result[0][i])
                  }
                }
              }
            }
          }
          // Сортировка просроченных
          for (let i = 0; i < result[1].length; i++) {
            if (result[1][i].readed) {
              this.overdueReaded.push(result[1][i])
            }
          }
          // Готово к сдаче
          this.$store.dispatch(TASK.READY_FOR_COMPLITION_TASKS_REQUEST)
            .then((resp) => {
              if (resp.data.anothers_markers.length) {
                this.$store.commit(PUSH_COLOR, resp.data.anothers_markers)
              }
              if (resp.data.anothers_tags.length) {
                this.$store.commit(TASK.ADD_TASK_TAGS, resp.data.anothers_tags)
              }
              for (let i = 0; i < resp.data.tasks.length; i++) {
                if (resp.data.tasks[i].readed) {
                  this.readyTasksReaded.push(resp.data.tasks[i])
                }
              }
            })
            .then(() => {
              // Отправляем в главный массив (непрочитанное) отсортированные массивы по очереди
              this.unreadTasks = [...this.unreadDelegateByMe, ...this.unreadDelegateToMe,
                ...this.readyTasksUnreaded, ...this.projectTasks, ...this.unsortedTasks]
              // Отправляем в главный массив (просрочено) отсортированные данные
              this.overdueTasks = [...this.overdueReaded]
              // Отправляем в главный массив (готовые) отсортированные данные
              this.readyTasks = [...this.readyTasksReaded]
              this.todayTasks = [...result[2]]
              this.openedTasks = [...this.openedTasks]
              // удаляем из массивов задачи со статусом "завершено"
              this.unreadTasks = this.unreadTasks.filter(task => (task.status !== TASK_STATUS.TASK_COMPLETED) && (task.status !== TASK_STATUS.TASK_REJECTED))
              this.overdueTasks = this.overdueTasks.filter(task => (task.status !== TASK_STATUS.TASK_COMPLETED) && (task.status !== TASK_STATUS.TASK_REJECTED))
              this.readyTasks = this.readyTasks.filter(task => (task.status !== TASK_STATUS.TASK_COMPLETED) && (task.status !== TASK_STATUS.TASK_REJECTED))
              this.todayTasks = this.todayTasks.filter(task => (task.status !== TASK_STATUS.TASK_COMPLETED) && (task.status !== TASK_STATUS.TASK_REJECTED))
              this.openedTasks = this.openedTasks.filter(task => (task.status !== TASK_STATUS.TASK_COMPLETED) && (task.status !== TASK_STATUS.TASK_REJECTED))
            })
        })
        .then(() => {
          this.tasksLoaded = true
        })
    },
    setSlidesCopy () {
      for (let i = 0; i < this.slides.length; i++) {
        if (this.slides[i].visible === 'true' || this.slides[i].visible === true) {
          this.slidesCopy.push(this.slides[i])
        }
      }
    },
    setNotifiesCopy () {
      this.notifiesCopy = this.notifies
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'doitnow')
      this.loadAllTasks()
    },
    readTask: function () {
      this.$store.dispatch(TASK.CHANGE_TASK_READ, this.firstTask.uid)
    },
    nextTask: function () {
      if (this.slidesCopy.length && this.justRegistered) {
        this.slidesCopy.shift()
        return
      }
      if (this.notifiesCopy.length) {
        this.notifiesCopy.shift()
        return
      }
      this.readTask()
      if (this.unreadTasks.length) {
        this.unreadTasks.shift()
        return
      }
      if (this.readyTasks.length) {
        this.readyTasks.shift()
        return
      }
      if (this.overdueTasks.length) {
        this.overdueTasks.shift()
        return
      }
      if (this.todayTasks.length) {
        this.todayTasks.shift()
        return
      }
      if (this.openedTasks.length) {
        this.openedTasks.shift()
      }
    },
    changeValue: function (objWithValues) {
      for (const elem in objWithValues) {
        this.firstTask[elem] = objWithValues[elem]
      }
    },
    onClickTask: function (task) {
      this.$store.commit('basic', { key: 'propertiesState', value: 'task' })
      this.$store.dispatch(TASK.SELECT_TASK, task)
      this.$store.dispatch('asidePropertiesToggle', true)
    }
  }
}
</script>

<style scoped>
.slide-in-fade-out-enter-from {
  transform: translateX(45px);
}

.slide-in-fade-out-enter-active {
  transition-delay: .4s;
  transition-property: opacity, transform;
  transition-duration: .4s;
}

.slide-in-fade-out-enter-from, .slide-in-fade-out-leave-to {
  opacity: 0;
}

.slide-in-fade-out-leave-active {
  transition-property: opacity, transform;
  transition-duration: .8s;
}

.slide-in-fade-out-leave-to {
  position: absolute;
  width: 100%;
}
</style>
