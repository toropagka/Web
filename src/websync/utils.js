import store from '@/store/index.js'
import { computed } from 'vue'
import router from '@/router'
import { TASK_STATUS } from '@/constants'

const user = computed(() => store.state.user.user)

function isTaskIsSharedForMe (task) {
  return (task.emails.includes(user.value.current_user_email) && (task.type === 1 || task.type === 2))
}

export function shouldAddTaskIntoList (task) {
  // Adding new task by date request
  // first look date_end in selected day
  //  check type 2 then check date_end < than selected date then add, if date_end > then throw away

  if (
    ifTaskHasParent(task) ||
    checkShouldAddByDateRequest(task) ||
    checkShouldAddTaskToAssignToRequest(task) ||
    checkShouldAddTaskToAssignByRequest(task) ||
    checkShouldAddTaskToReady(task) ||
    checkShouldAddTaskToProjectRequest(task) ||
    checkShouldAddTaskToOverdueRequest(task) ||
    checkShouldAddTaskToUnreadRequest(task) ||
    checkShouldAddTaskToFocusRequest(task) ||
    addToUnsortedList()
  ) {
    return true
  }
  return false
}

// Проверяет
function checkShouldAddByDateRequest (task) {
  // Костыльно исправляем случай, когда редактируем задачу в поиске
  if (router.currentRoute.value.name === 'task') {
    return true
  }

  if (!['tasksToday', 'tasksByDate'].includes(router.currentRoute.value.name)) {
    return
  }

  const selectedDate = router.currentRoute.name === 'tasksToday' ? new Date() : new Date(router.currentRoute.value.params.date)
  selectedDate.setHours(0, 0, 0, 0)

  const isTaskCompleted = (task.status === TASK_STATUS.TASK_COMPLETED || task.status === TASK_STATUS.TASK_CANCELLED) ||
        (task.type === 3 && (task.status === TASK_STATUS.TASK_READY || task.status === TASK_STATUS.TASK_REJECTED))

  if (
    task.date_begin &&
    task.date_begin !== '0001-01-01T00:00:00'
  ) {
    const taskDateEnd = new Date(task.date_end)
    taskDateEnd.setHours(0, 0, 0, 0)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (
      task.type !== 2 &&
      selectedDate.toLocaleString().split(',')[0] === new Date(task.date_begin).toLocaleString().split(',')[0]
    ) {
      return true
    } else if (
      selectedDate <= currentDate
    ) {
      if (!isTaskCompleted && taskDateEnd < selectedDate) {
        return true
      }
    }
  } else if (
    task.customer_date_begin &&
    task.customer_date_begin !== '0001-01-01T00:00:00' &&
    (isTaskIsSharedForMe(task) || task.type === 3)
  ) {
    const taskDateEnd = new Date(task.customer_date_end)
    taskDateEnd.setHours(0, 0, 0, 0)
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (
      task.type !== 2 &&
      selectedDate.toLocaleString().split(',')[0] === new Date(task.customer_date_begin).toLocaleString().split(',')[0]
    ) {
      return true
    } else if (
      selectedDate <= currentDate
    ) {
      if (!isTaskCompleted && taskDateEnd < selectedDate) {
        return true
      }
    }
  }

  return false
}

// Поручено мной
function checkShouldAddTaskToAssignToRequest (task) {
  // Adding new task by assigned to property
  if (
    router.currentRoute.value.name === 'tasksDelegateByMe' &&
    router.currentRoute.value.params.employee_uid === task.uid_performer
  ) {
    if (
      task.email_performer &&
      task.email_performer !== user.value.current_user_email &&
      task.uid_customer === user.value.current_user_uid
    ) {
      return true
    }
  }
}

// Поручено мне
function checkShouldAddTaskToAssignByRequest (task) {
  // Adding new task by assigned by property
  if (
    router.currentRoute.value.name === 'tasksDelegateToMe' &&
    router.currentRoute.value.params.employee_uid === task.uid_customer
  ) {
    if (
      task.email_performer &&
      task.email_performer === user.value.current_user_email &&
      task.uid_customer !== user.value.current_user_uid
    ) {
      return true
    }
  }
}

function checkShouldAddTaskToProjectRequest (task) {
  // Добавляем задачу в список задач проекта
  if (
    router.currentRoute.value.name === 'project' &&
    router.currentRoute.value.params.project_id === task.uid_project
  ) {
    if (
      task.uid_project &&
      task.uid_project !== '00000000-0000-0000-0000-000000000000'
    ) {
      return true
    }
  }
}

function checkShouldAddTaskToOverdueRequest (task) {
  // Adding new task by overdue flag
  if (router.currentRoute.value.name === 'tasksOverdue') {
    if (
      task.email_performer &&
      task.email_performer === user.value.current_user_email &&
      task.overdue
    ) {
      return true
    }
  }
}

function checkShouldAddTaskToReady (task) {
  if (router.currentRoute.value.name === 'tasksReady') {
    if (
      task.uid_customer === user.value.current_user_uid &&
      task.status === TASK_STATUS.TASK_READY
    ) {
      return true
    }
  }
}

function checkShouldAddTaskToUnreadRequest (task) {
  // Adding new task by unread flag
  if (router.currentRoute.value.name === 'tasksUnread') {
    if (task.readed === 0) {
      return true
    }
  }
}

function checkShouldAddTaskToFocusRequest (task) {
  // Adding new task by focus flag
  if (router.currentRoute.value.name === 'tasksInFocus') {
    if (task.focus === 1) {
      return true
    }
  }
}

function ifTaskHasParent (task) {
  if (task.uid_parent && task.uid_parent !== '00000000-0000-0000-0000-000000000000') {
    return true
  }
}

function addToUnsortedList () {
  // Add to unsorted list
  if (router.currentRoute.value.name === 'taskUnsorted') {
    return true
  }
}
