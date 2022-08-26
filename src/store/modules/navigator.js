import axios from 'axios'
import { PUSH_BOARD } from '../actions/boards'
import { PUSH_COLOR, PUSH_MYCOLOR } from '../actions/colors'
import { PUSH_DEPARTMENT } from '../actions/departments'
import { PUSH_EMPLOYEE, PUSH_EMPLOYEE_BY_EMAIL } from '../actions/employees'
import {
  NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT,
  NAVIGATOR_ERROR,
  NAVIGATOR_PUSH_BOARD,
  NAVIGATOR_PUSH_COLOR,
  NAVIGATOR_PUSH_DEPARTAMENT,
  NAVIGATOR_PUSH_EMPLOYEE,
  NAVIGATOR_PUSH_PROJECT,
  NAVIGATOR_PUSH_REGLAMENT,
  NAVIGATOR_PUSH_TAG,
  NAVIGATOR_REMOVE_BOARD,
  NAVIGATOR_REMOVE_COLOR,
  NAVIGATOR_REMOVE_DEPARTAMENT,
  NAVIGATOR_REMOVE_EMPLOYEE,
  NAVIGATOR_REMOVE_PROJECT,
  NAVIGATOR_REMOVE_REGLAMENT,
  NAVIGATOR_REMOVE_TAG,
  NAVIGATOR_REQUEST,
  NAVIGATOR_SUCCESS,
  NAVIGATOR_UPDATE_ASSIGNMENTS,
  NAVIGATOR_UPDATE_DEPARTMENT,
  NAVIGATOR_UPDATE_EMPLOYEE,
  NAVIGATOR_UPDATE_REGLAMENT,
  PATCH_SETTINGS,
  PATCH_SETTINGS_SUCCESS,
  RESET_STATE_NAVIGATOR
} from '../actions/navigator'
import { PUSH_PROJECT } from '../actions/projects'
import { ADD_TASK_TAGS } from '../actions/tasks'
import { visitChildren } from '../helpers/functions'

const getDefaultState = () => {
  return {
    navigator: false,
    submenu: {
      status: false,
      path: ''
    },
    lastTab: localStorage.getItem('lastTab') ?? 'doitnow',
    currentSettingsTab: localStorage.getItem('lastTab') === 'settings' ? localStorage.getItem('currentSettingsTab') : '',
    status: '',
    computedNavigator: false,
    hasLoadedOnce: false,
    menu: []
  }
}

function getAllMembersByDepartmentUID (emps, departmentUID) {
  const employeesStuck = []
  for (const employee of emps) {
    if (employee.uid_dep === departmentUID) {
      employeesStuck.push(employee)
    }
  }
  return employeesStuck
}

const state = getDefaultState()

const getters = {
  getNavigator: (state) => state.navigator,
  navigatorStatus: (state) => state.status,
  sortedNavigator: (state) => {
    state.navigator?.new_private_boards[1]?.items.sort((board1, board2) => {
      return board1?.name.localeCompare(board2?.name)
    })
    state.navigator?.new_private_projects[1]?.items.sort(
      (project1, project2) => {
        return project1?.name.localeCompare(project2?.name)
      }
    )
    return state.navigator
  }
}

const actions = {
  [NAVIGATOR_REQUEST]: ({ commit, dispatch, rootState }) => {
    return new Promise((resolve, reject) => {
      commit(NAVIGATOR_REQUEST)
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/info'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resp.rootState = rootState

          if (resp.data.delegate_iam) {
            for (const dm of resp.data.delegate_iam.items) {
              dm.parentID = resp.data.delegate_iam.uid
            }
          }
          if (resp.data.delegate_to_me) {
            for (const dt of resp.data.delegate_to_me.items) {
              dt.parentID = resp.data.delegate_to_me.uid
            }
          }
          if (resp.data.emps.items) {
            for (const employee of resp.data.emps.items) {
              employee.parentID = resp.data.emps.uid
              commit(PUSH_EMPLOYEE, employee)
              commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
            }
          }
          commit(NAVIGATOR_SUCCESS, resp)
          // TODO: we are doing the same thing 3 times, DRY
          // process colors in shared vuex storage
          if (resp.data.colors.items) {
            commit(PUSH_COLOR, resp.data.colors.items)
            commit(PUSH_MYCOLOR, resp.data.colors.items)
            visitChildren(resp.data.colors.items, (value) => {
              value.parentID = resp.data.colors.uid
            })
          }
          // process private projects then put them in shared vuex storage
          if (resp.data.private_projects.items) {
            const myPrivateProjects = []
            visitChildren(resp.data.private_projects.items, (value) => {
              value.global_property_uid = resp.data.private_projects.uid
              myPrivateProjects.push(value)
            })
            commit(PUSH_PROJECT, myPrivateProjects)
          }
          // process shared projects then put them in shared vuex storage
          if (resp.data.common_projects.items) {
            const myCommonProjects = []
            visitChildren(resp.data.common_projects.items, (value) => {
              value.global_property_uid = resp.data.common_projects.uid
              myCommonProjects.push(value)
            })
            commit(PUSH_PROJECT, myCommonProjects)
          }

          if (resp.data.private_boards.items) {
            const myPrivateBoards = []
            visitChildren(resp.data.private_boards.items, (value) => {
              value.global_property_uid = resp.data.private_boards.uid
              myPrivateBoards.push(value)
            })
            commit(PUSH_BOARD, myPrivateBoards)
          }
          if (resp.data.common_projects.items) {
            const myCommonBoards = []
            visitChildren(resp.data.common_boards.items, (value) => {
              value.global_property_uid = resp.data.common_boards.uid
              myCommonBoards.push(value)
            })
            commit(PUSH_BOARD, myCommonBoards)
          }
          if (resp.data.deps.items) {
            for (const department of resp.data.deps.items) {
              commit(PUSH_DEPARTMENT, department)
            }
          }
          // process tags then put them in shared vuex storage
          if (resp.data.tags.items) {
            const myTags = []
            visitChildren(resp.data.tags.items, (value) => {
              // TODO: how to remove children without hurt actual data?
              value.global_property_uid = resp.data.tags.uid
              myTags.push(value)
            })
            commit(ADD_TASK_TAGS, myTags)
          }
          dispatch('setDots', resp.data.calendar.dates_with_tasks)
          resolve(resp)
        })
        .catch((err) => {
          commit(NAVIGATOR_ERROR, err)
          reject(err)
        })
    })
  },
  [PATCH_SETTINGS]: ({ commit, dispatch }, settings) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/settings/all'
      axios({ url: url, method: 'PATCH', data: settings })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [NAVIGATOR_UPDATE_EMPLOYEE]: ({ commit, dispatch }, employee) => {
    commit(NAVIGATOR_UPDATE_EMPLOYEE, employee)
    commit(PUSH_EMPLOYEE, employee)
    commit(PUSH_EMPLOYEE_BY_EMAIL, employee)
  },
  [NAVIGATOR_UPDATE_ASSIGNMENTS]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/navigator/assignments'
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          if (resp.data.delegate_iam) {
            for (const dm of resp.data.delegate_iam.items) {
              dm.parentID = resp.data.delegate_iam.uid
            }
          }
          if (resp.data.delegate_to_me) {
            for (const dt of resp.data.delegate_to_me.items) {
              dt.parentID = resp.data.delegate_to_me.uid
            }
          }
          commit(NAVIGATOR_UPDATE_ASSIGNMENTS, resp)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [NAVIGATOR_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [NAVIGATOR_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.hasLoadedOnce = true
    console.log('navigator ', resp)
    state.menu = []
    if (state.lastTab === 'tasks' || state.lastTab === 'doitnow') {
      state.menu.push([
        {
          label: 'Просроченные',
          uid: '46418722-a720-4c9e-b255-16db4e590c34',
          bold: false,
          icon: 'M18.283 22.2558L18.3026 22.2846C18.6498 22.7855 19.1424 23.178 19.7195 23.4009C19.7331 23.4061 19.7467 23.4113 19.7604 23.4163C20.0915 23.5387 20.4495 23.6056 20.8231 23.6056C22.5154 23.6056 23.8873 22.2337 23.8873 20.5413C23.8873 20.1175 23.8013 19.7138 23.6458 19.3468C23.6224 19.2917 23.5975 19.2374 23.5711 19.1841C23.3132 18.663 22.9115 18.2258 22.4179 17.9243C22.3893 17.9068 22.3603 17.8898 22.3311 17.8732C21.8859 17.621 21.3713 17.4771 20.8231 17.4771C19.1307 17.4771 17.7588 18.849 17.7588 20.5413C17.7588 21.1765 17.9521 21.7665 18.283 22.2558ZM22.9036 16.4417C22.2789 16.124 21.5719 15.9449 20.8231 15.9449C18.2846 15.9449 16.2267 18.0028 16.2267 20.5413C16.2267 21.3666 16.4441 22.141 16.8249 22.8104C16.0862 23.0166 15.3075 23.1268 14.503 23.1268C9.7433 23.1268 5.88478 19.2683 5.88478 14.5086C5.88478 9.74885 9.7433 5.89033 14.503 5.89033C19.2628 5.89033 23.1213 9.74885 23.1213 14.5086C23.1213 15.1732 23.046 15.8203 22.9036 16.4417ZM24.3696 17.6172C24.6784 16.636 24.8449 15.5918 24.8449 14.5086C24.8449 8.79691 20.2147 4.16669 14.503 4.16669C8.79136 4.16669 4.16113 8.79691 4.16113 14.5086C4.16113 20.2202 8.79136 24.8505 14.503 24.8505C15.7554 24.8505 16.9559 24.6278 18.0669 24.22C18.8348 24.7963 19.7891 25.1377 20.8231 25.1377C23.3616 25.1377 25.4195 23.0799 25.4195 20.5413C25.4195 19.4306 25.0254 18.4118 24.3696 17.6172ZM15.2683 10.4868C14.8048 10.4868 14.4316 10.8638 14.4316 11.3234V15.2326H12.7542C12.2907 15.2326 11.9175 15.6097 11.9175 16.0692C11.9175 16.5287 12.2907 16.9058 12.7542 16.9058H15.2683C15.7319 16.9058 16.1051 16.5287 16.1051 16.0692V11.3234C16.1051 10.8638 15.7319 10.4868 15.2683 10.4868ZM20.8949 21.3987C21.2391 21.3987 21.5161 21.1195 21.5161 20.7726V18.8693C21.5161 18.5224 21.2391 18.2432 20.8949 18.2432C20.5507 18.2432 20.2737 18.5224 20.2737 18.8693V20.781C20.2737 21.1195 20.5507 21.3987 20.8949 21.3987ZM20.8949 21.7879C20.5423 21.7879 20.2485 22.0841 20.2485 22.4394C20.2485 22.7948 20.5423 23.0909 20.8949 23.0909C21.2475 23.0909 21.5413 22.7948 21.5413 22.4394C21.5413 22.0841 21.2475 21.7879 20.8949 21.7879Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        },
        {
          label: 'Неразобранные',
          uid: '5183b619-3968-4c3a-8d87-3190cfaab014',
          bold: false,
          icon: 'M26 12.3422C26 11.6962 25.4763 11.1725 24.8303 11.1725H5.16971C4.5237 11.1725 4 11.6962 4 12.3422C4 12.9882 4.5237 13.5119 5.16971 13.5119H24.8303C25.4763 13.5119 26 12.9882 26 12.3422Z M20.3657 6.16971C20.3657 5.5237 19.842 5 19.196 5H5.16971C4.5237 5 4 5.5237 4 6.16971C4 6.81573 4.5237 7.33942 5.16971 7.33942H19.196C19.842 7.33942 20.3657 6.81573 20.3657 6.16971Z M22.5386 18.5624C22.5386 17.9164 22.0149 17.3927 21.3688 17.3927H5.16971C4.5237 17.3927 4 17.9164 4 18.5624C4 19.2084 4.5237 19.7321 5.16971 19.7321H21.3688C22.0149 19.7321 22.5386 19.2084 22.5386 18.5624Z M14.0494 24.7827C14.0494 24.1367 13.5257 23.613 12.8797 23.613H5.16971C4.5237 23.613 4 24.1367 4 24.7827C4 25.4287 4.5237 25.9524 5.16971 25.9524H12.8797C13.5257 25.9524 14.0494 25.4287 14.0494 24.7827Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        },
        {
          label: 'Непрочитанные',
          uid: 'fa042915-a3d2-469c-bd5a-708cf0339b89',
          bold: false,
          icon: 'M22.6793 6.92814C22.505 6.75384 22.2726 6.66669 22.0111 6.66669C21.7497 6.66669 21.5173 6.75384 21.343 6.92814L18.7575 9.5136C17.4503 8.9326 16.0849 8.64209 14.7196 8.64209C12.628 8.64209 10.5363 9.31025 8.50284 10.6466C5.91738 12.3315 4.37772 14.4521 4.34867 14.4812C4.08722 14.8298 4.11627 15.2946 4.37772 15.6141C5.74308 17.299 7.19558 18.6353 8.67714 19.594L6.49838 21.8018C6.14978 22.1504 6.14978 22.7605 6.49838 23.1381C6.67268 23.3124 6.90508 23.3996 7.16653 23.3996C7.42798 23.3996 7.66039 23.3124 7.83469 23.1381L22.6793 8.26444C23.0279 7.91584 23.0279 7.30579 22.6793 6.92814ZM6.32408 15.0331C6.90508 14.365 8.03804 13.203 9.51959 12.2443C11.2626 11.1114 13.0056 10.5304 14.7196 10.5304C15.5911 10.5304 16.4916 10.6756 17.3341 10.9952L16.4626 11.8667C15.8816 11.5471 15.2425 11.3438 14.5743 11.3438C13.5866 11.3438 12.657 11.7214 11.9598 12.4186C11.2626 13.1158 10.8849 14.0454 10.8849 15.0331C10.8849 15.7013 11.0592 16.3404 11.4079 16.9214L10.0715 18.2577C8.79334 17.5024 7.54418 16.4275 6.32408 15.0331ZM13.2961 13.7259C13.6447 13.3773 14.1095 13.1739 14.6034 13.1739C14.7486 13.1739 14.9229 13.203 15.0682 13.232L12.8313 15.4689C12.8023 15.3236 12.7732 15.1784 12.7732 15.0041C12.7442 14.5393 12.9475 14.0745 13.2961 13.7259Z M24.8 14.4521C23.7542 13.1739 22.6793 12.0991 21.5754 11.2276C21.4011 11.1114 21.1977 11.0242 20.9944 11.0242C20.7039 11.0242 20.4424 11.1404 20.2391 11.3728C19.9195 11.7795 20.0067 12.3605 20.4134 12.6801C21.2268 13.3192 22.0402 14.1035 22.8536 15.0331C22.2726 15.7013 21.372 16.6018 20.2391 17.4443C18.3218 18.8387 16.3754 19.5359 14.4872 19.5359C13.9352 19.5359 13.4123 19.4778 12.8604 19.3616C12.8023 19.3616 12.7442 19.3325 12.657 19.3325C12.2213 19.3325 11.8436 19.6521 11.7565 20.0878C11.6984 20.3202 11.7565 20.5817 11.8727 20.785C12.0179 20.9884 12.2213 21.1336 12.4537 21.1917C13.0928 21.337 13.7609 21.3951 14.4581 21.3951C15.4749 21.3951 16.4916 21.2498 17.4793 20.9303C18.7866 20.5236 20.0938 19.8554 21.372 18.9258C23.3475 17.4733 24.5966 15.9046 24.829 15.5851C25.0614 15.2365 25.0614 14.7717 24.8 14.4521Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        },
        {
          label: 'В работе',
          uid: '2a5cae4b-e877-4339-8ca1-bd61426864ec',
          bold: false,
          icon: 'M8.46116 22.6199L21.893 14.865L8.46116 7.1101L8.46116 22.6199ZM22.9465 16.6897C24.3512 15.8787 24.3512 13.8513 22.9465 13.0403L9.51464 5.28542C8.11 4.47445 6.3542 5.48817 6.3542 7.1101V22.6199C6.3542 24.2418 8.11 25.2555 9.51464 24.4446L22.9465 16.6897Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        },
        {
          label: 'Задачи в фокусе',
          uid: '6fc44cc6-9d45-4052-917e-25b1189ab141',
          bold: false,
          icon: 'M21.0096 5.83331H8.99077C8.62927 5.83331 8.3335 6.1487 8.3335 6.53418V23.4658C8.3335 23.7578 8.50877 24.0206 8.7662 24.1258C8.83741 24.155 8.91409 24.1666 8.99077 24.1666C9.18248 24.1666 9.36871 24.0732 9.49469 23.9155L15.0002 18.9771L20.5056 23.9155C20.6316 24.0732 20.8124 24.1666 21.0096 24.1666C21.0862 24.1666 21.1629 24.155 21.2341 24.1258C21.4916 24.0265 21.6668 23.7578 21.6668 23.4658V6.53418C21.6668 6.1487 21.3711 5.83331 21.0096 5.83331ZM14.4962 17.3958L9.79183 21.7285V7.38279L20.2085 7.37273V21.7184L15.5041 17.3958C15.3781 17.2381 15.1973 17.1446 15.0002 17.1446C14.803 17.1446 14.6222 17.2381 14.4962 17.3958Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        },
        {
          label: 'Готово к сдаче',
          uid: 'd35fe0bc-1747-4eb1-a1b2-3411e07a92a0',
          bold: false,
          icon: 'M22.781 8.88555C23.1009 9.20546 23.1009 9.71404 22.781 10.034L13.479 19.336C13.4039 19.412 13.3145 19.4723 13.2159 19.5135C13.1173 19.5546 13.0116 19.5758 12.9048 19.5758C12.7979 19.5758 12.6922 19.5546 12.5936 19.5135C12.495 19.4723 12.4056 19.412 12.3306 19.336L8.88537 15.8908C8.80938 15.8157 8.74905 15.7263 8.70787 15.6277C8.66669 15.5292 8.64549 15.4234 8.64549 15.3166C8.64549 15.2098 8.66669 15.104 8.70787 15.0054C8.74905 14.9069 8.80938 14.8175 8.88537 14.7424C8.96045 14.6664 9.04986 14.6061 9.14842 14.5649C9.24699 14.5237 9.35275 14.5025 9.45957 14.5025C9.56639 14.5025 9.67215 14.5237 9.77071 14.5649C9.86928 14.6061 9.95869 14.6664 10.0338 14.7424L12.9048 17.6134L21.6326 8.88555C21.7076 8.80956 21.7971 8.74923 21.8956 8.70805C21.9942 8.66687 22.1 8.64567 22.2068 8.64567C22.3136 8.64567 22.4194 8.66687 22.5179 8.70805C22.6165 8.74923 22.7059 8.80956 22.781 8.88555ZM21.0502 7.14655L12.9048 15.292L10.6162 13.0034C9.97635 12.3636 8.93459 12.3636 8.29477 13.0034L7.14637 14.1518C6.50655 14.7916 6.50655 15.8334 7.14637 16.4732L11.74 21.0668C12.3798 21.7066 13.4215 21.7066 14.0614 21.0668L24.52 10.6164C25.1598 9.97653 25.1598 8.93477 24.52 8.29495L23.3716 7.14655C22.7236 6.50673 21.69 6.50673 21.0502 7.14655Z',
          iconBox: '0 0 30 30',
          width: 30,
          height: 30,
          type: 'uid',
          iconBackgroundClass: ''
        }
      ])
    }

    // Если только переходим на другой таб (код выше), без запроса к серверу
    // используется в DoitnowEmpty.vue
    if (!resp) {
      return
    }

    const newAssignments = []
    newAssignments.push({
      dep: 'Поручено мной',
      items: resp.data.delegate_iam.items
    })
    newAssignments.push({
      dep: 'Поручено мне',
      items: resp.data.delegate_to_me.items
    })
    resp.data.new_delegate = newAssignments

    // Merge emps to deps like new private projects
    const dataEmps = [...resp.data.emps?.items]
    const newEmps = []
    newEmps.push({
      dep: { uid: '', name: 'Вне отдела' },
      items: getAllMembersByDepartmentUID(
        dataEmps,
        '00000000-0000-0000-0000-000000000000'
      )
    })
    for (const department of resp.data.deps.items) {
      const dep = {
        dep: department,
        items: getAllMembersByDepartmentUID(dataEmps, department.uid)
      }
      newEmps.push(dep)
    }
    resp.data.new_emps = newEmps

    // Merge common projects and private projects into my own data structure
    // Array of objects where object is { dep: 'Dependency name', items: items }
    const itemsInProjectView = []
    itemsInProjectView.push({
      dep: 'Мои проекты',
      items: resp.data.private_projects.items,
      type: 'projects'
    })
    itemsInProjectView.push({
      dep: 'Общие проекты',
      items: resp.data.common_projects.items,
      type: 'projects'
    })
    resp.data.new_private_projects = itemsInProjectView

    const newCommonBoards = []
    newCommonBoards.push({
      dep: 'Мои доски',
      items: resp.data.private_boards.items
    })
    newCommonBoards.push({
      dep: 'Общие доски',
      items: resp.data.common_boards.items
    })
    resp.data.new_private_boards = newCommonBoards
    state.navigator = resp.data
  },
  [NAVIGATOR_UPDATE_ASSIGNMENTS]: (state, resp) => {
    const newAssignments = []
    newAssignments.push({
      dep: 'Поручено мной',
      items: resp.data.delegate_iam.items
    })
    newAssignments.push({
      dep: 'Поручено мне',
      items: resp.data.delegate_to_me.items
    })
    state.navigator.delegate_iam = resp.data.delegate_iam
    state.navigator.delegate_to_me = resp.data.delegate_to_me
    state.navigator.new_delegate = newAssignments
  },
  [NAVIGATOR_PUSH_DEPARTAMENT]: (state, departaments) => {
    for (const departament of departaments) {
      if (
        departament.uid_parent ||
        departament.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding departament to the root
        state.navigator.deps.items.push(departament)
      } else {
        // adding departament recursively to subarrays
        visitChildren(state.navigator.deps.items, (value) => {
          if (value.uid === departament.uid_parent) {
            value.children.push(departament)
          }
        })
      }
      // добавить в new_emps
      state.navigator.new_emps.push({
        dep: departament,
        items: getAllMembersByDepartmentUID(
          state.navigator.emps.items,
          departament.uid
        )
      })
    }
  },
  [NAVIGATOR_PUSH_REGLAMENT]: (state, reglament) => {
    state.navigator.reglaments.items.push(reglament)
  },
  [NAVIGATOR_REMOVE_REGLAMENT]: (state, reglament) => {
    // Проверка для правильной работы вебсинка, т.к он вместо объекта присылает только UID регламента
    const uid = typeof reglament === 'object' ? reglament.uid : reglament
    for (let i = 0; i < state.navigator.reglaments.items.length; i++) {
      if (state.navigator.reglaments.items[i].uid === uid) {
        state.navigator.reglaments.items.splice(i, 1)
        return
      }
    }
  },
  [NAVIGATOR_REMOVE_DEPARTAMENT]: (state, uidDepartment) => {
    // удаляем  из new_emps
    const indexEmps = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepartment
    )
    if (indexEmps !== -1) {
      const emps = state.navigator.new_emps[indexEmps]
      const rootEmps = state.navigator.new_emps.find(
        (emps) => emps.dep.uid === ''
      )
      if (rootEmps && emps) {
        rootEmps.items.push(...emps.items)
      }
      state.navigator.new_emps.splice(indexEmps, 1)
    }
    // удаляем из deps
    const indexDeps = state.navigator.deps.items.findIndex(
      (dep) => dep.uid === uidDepartment
    )
    if (indexDeps !== -1) state.navigator.deps.items.splice(indexDeps, 1)
  },
  [NAVIGATOR_UPDATE_DEPARTMENT]: (state, department) => {
    const indexEmps = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === department.uid
    )
    if (indexEmps !== -1) {
      state.navigator.new_emps[indexEmps].dep = department
    }

    const indexDeps = state.navigator.deps.items.findIndex(
      (dep) => dep.uid === department.uid
    )
    if (indexDeps !== -1) state.navigator.deps.items[indexDeps] = department
  },
  [NAVIGATOR_CHANGE_EMPLOYEE_DEPARTMENT]: (state, data) => {
    const uidDepOld =
      data.uidDepartmentOld === '00000000-0000-0000-0000-000000000000'
        ? ''
        : data.uidDepartmentOld
    const uidDepNew =
      data.uidDepartmentNew === '00000000-0000-0000-0000-000000000000'
        ? ''
        : data.uidDepartmentNew
    const indexEmpsOld = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepOld
    )
    const indexEmpsNew = state.navigator.new_emps.findIndex(
      (emps) => emps.dep.uid === uidDepNew
    )
    const empsOld = state.navigator.new_emps[indexEmpsOld]
    const empsNew = state.navigator.new_emps[indexEmpsNew]
    if (empsOld && empsNew && empsOld.dep.uid !== empsNew.dep.uid) {
      // отдел поменялся - перемещаем сотрудника
      const indexEmp = empsOld.items.findIndex((emp) => emp.uid === data.uidEmp)
      const [emp] = empsOld.items.splice(indexEmp, 1)
      empsNew.items.push(emp)
      emp.uid_dep = empsNew.dep.uid || '00000000-0000-0000-0000-000000000000'
    }
  },
  [NAVIGATOR_PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      if (
        !project.uid_parent ||
        project.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_projects[0].items.push(project)
      } else {
        // adding projects recursively to subarrays
        visitChildren(
          state.navigator.new_private_projects[0].items,
          (value) => {
            if (value.uid === project.uid_parent) {
              value.children.push(project)
            }
          }
        )
      }
    }
  },
  [NAVIGATOR_PUSH_BOARD]: (state, boards) => {
    for (const board of boards) {
      if (
        !board.uid_parent ||
        board.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding projects to the root
        state.navigator.new_private_boards[0].items.push(board)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.new_private_boards[0].items, (value) => {
          if (value.uid === board.uid_parent) {
            value.children.push(board)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_TAG]: (state, tags) => {
    for (const tag of tags) {
      if (
        !tag.uid_parent ||
        tag.uid_parent === '00000000-0000-0000-0000-000000000000'
      ) {
        // adding tags to the root
        state.navigator.tags.items.push(tag)
      } else {
        // adding projects recursively to subarrays
        visitChildren(state.navigator.tags.items, (value) => {
          if (value.uid === tag.uid_parent) {
            value.children.push(tag)
          }
        })
      }
    }
  },
  [NAVIGATOR_PUSH_COLOR]: (state, colors) => {
    for (const color of colors) {
      state.navigator.colors.items.push(color)
    }
  },
  NAVIGATOR_UPDATE_COLOR: (state, colors) => {
    visitChildren(state.navigator.colors.items, (value, index) => {
      if (value.uid === colors.uid) {
        Object.assign(value, colors)
      }
    })
  },
  [NAVIGATOR_UPDATE_REGLAMENT]: (state, reglament) => {
    for (let i = 0; i < state.navigator.reglaments.items.length; i++) {
      if (state.navigator.reglaments.items[i].uid === reglament.uid) {
        Object.assign(state.navigator.reglaments.items[i], reglament)
        return
      }
    }
  },
  NAVIGATOR_UPDATE_TAG: (state, tag) => {
    visitChildren(state.navigator.tags.items, (value) => {
      if (value.uid === tag.uid) {
        Object.assign(value, tag)
      }
    })
  },
  [NAVIGATOR_PUSH_EMPLOYEE]: (state, employees) => {
    for (const employee of employees) {
      state.navigator.emps.items.push(employee)
      const dep =
        employee.uid_dep === '00000000-0000-0000-0000-000000000000'
          ? ''
          : employee.uid_dep
      const emps = state.navigator.new_emps.find((emps) => emps.dep.uid === dep)
      emps?.items?.push(employee)
    }
  },
  [NAVIGATOR_REMOVE_PROJECT]: (state, project) => {
    if (
      !project.uid_parent ||
      project.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_projects[0].items.length;
        i++
      ) {
        if (
          state.navigator.new_private_projects[0].items[i].uid === project.uid
        ) {
          state.navigator.new_private_projects[0].items.splice(i, 1)
        }
      }
      for (
        let i = 0;
        i < state.navigator.new_private_projects[1].items.length;
        i++
      ) {
        if (
          state.navigator.new_private_projects[1].items[i].uid === project.uid
        ) {
          state.navigator.new_private_projects[1].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_projects[0].items,
        (value, index) => {
          if (value.uid === project.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === project.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_REMOVE_BOARD]: (state, board) => {
    if (
      !board.uid_parent ||
      board.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (
        let i = 0;
        i < state.navigator.new_private_boards[0].items.length;
        i++
      ) {
        if (state.navigator.new_private_boards[0].items[i].uid === board.uid) {
          state.navigator.new_private_boards[0].items.splice(i, 1)
        }
      }
      for (
        let i = 0;
        i < state.navigator.new_private_boards[1].items.length;
        i++
      ) {
        if (state.navigator.new_private_boards[1].items[i].uid === board.uid) {
          state.navigator.new_private_boards[1].items.splice(i, 1)
        }
      }
    } else {
      visitChildren(
        state.navigator.new_private_boards[0].items,
        (value, index) => {
          if (value.uid === board.uid_parent) {
            for (let i = 0; i < value.children.length; i++) {
              if (value.children[i].uid === board.uid) {
                // remove element without mutation
                value.children.splice(i, 1)
              }
            }
          }
        }
      )
    }
  },
  [NAVIGATOR_UPDATE_EMPLOYEE]: (state, employee) => {
    for (const dep of state.navigator.new_emps) {
      for (let i = 0; i < dep.items.length; i++) {
        if (dep.items[i].uid === employee.uid) {
          dep.items[i] = employee
        }
      }
    }
  },
  [NAVIGATOR_REMOVE_EMPLOYEE]: (state, employee) => {
    for (const dep of state.navigator.new_emps) {
      for (let i = 0; i < dep.items.length; i++) {
        if (dep.items[i].uid === employee.uid) {
          dep.items.splice(i, 1)
        }
      }
    }
  },
  [NAVIGATOR_REMOVE_TAG]: (state, tag) => {
    // removing wihtout mutation even on root level
    if (
      !tag.uid_parent ||
      tag.uid_parent === '00000000-0000-0000-0000-000000000000'
    ) {
      for (let i = 0; i < state.navigator.tags.items.length; i++) {
        if (state.navigator.tags.items[i].uid === tag.uid) {
          state.navigator.tags.items.splice(i, 1)
        }
      }
    } else {
      visitChildren(state.navigator.tags.items, (value, index) => {
        if (value.uid === tag.uid_parent) {
          for (let i = 0; i < value.children.length; i++) {
            if (value.children[i].uid === tag.uid) {
              // remove element without mutationy
              value.children.splice(i, 1)
            }
          }
        }
      })
    }
  },
  [NAVIGATOR_REMOVE_COLOR]: (state, color) => {
    for (let i = 0; i < state.navigator.colors.items.length; i++) {
      if (state.navigator.colors.items[i].uid === color.uid) {
        state.navigator.colors.items.splice(i, 1)
      }
    }
  },
  NAVIGATOR_UPDATE_PROJECT: (state, project) => {
    visitChildren(
      state.navigator.new_private_projects[0].items,
      (value, index) => {
        if (value.uid === project.uid) {
          Object.assign(value, project)
        }
      }
    )
  },
  [NAVIGATOR_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [PATCH_SETTINGS_SUCCESS]: (state, resp) => {
    state.navigator.settings = resp
  },
  [RESET_STATE_NAVIGATOR]: (state) => {
    Object.assign(state, getDefaultState())
  },
  initInviteMe (state, data) {
    if (!('invite_me' in state.navigator)) state.navigator.invite_me = {}

    state.navigator.invite_me.uid = data.uid
    state.navigator.invite_me.uid_owner_org = data.uid_org
    state.navigator.invite_me.name_owner_org = data.director_name
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
