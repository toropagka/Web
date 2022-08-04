<script>
import AsideMenu from '@/components/AsideMenu.vue'
import Tabs from '@/components/Tabs/Tabs.vue'
import initWebSync from '@/websync/index.js'
import * as TASK from '@/store/actions/tasks.js'
import { UID_TO_ACTION } from '@/store/helpers/functions'
import initInspectorSocket from '@/inspector/index.js'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'

import { LOCALIZATION_REQUEST } from '@/store/actions/localization'

// очищаем консоль - по идее выше ошибки которые
// мы не можем поправить из fm.websync и fm.min
// по этому консоль очищаем
export default {
  components: {
    AsideMenu,
    Tabs
  },
  computed: {
    menu () {
      return this.$store.state.navigator.menu
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    navStack () {
      return this.$store.state.navbar.navStack
    }
  },
  mounted () {
    console.clear()
    this.$store.dispatch(LOCALIZATION_REQUEST)

    if (this.$store.state.auth.token) {
      this.$store.dispatch(USER_REQUEST).then(resp => {
        this.$store.dispatch('GET_SOUND_SETTING', resp.data.current_user_uid)
        this.getNavigator()
        if (this.$router.currentRoute.value.name === 'task' && this.$router.currentRoute.value.params.id) {
          this.getTask(this.$router.currentRoute.value.params.id)
        } else {
          this.getTasks()
        }
      })
    }

    const fm = document.createElement('script')
    fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
    fm.onload = () => {
      // подключаем скрыпты в правильном порядке - сначала fm.min потом fm.websync.min
      const websync = document.createElement('script')
      websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
      document.head.appendChild(websync)
    }
    document.head.appendChild(fm)
  },
  methods: {
    getNavigator () {
      if (this.$store.state.auth.token) {
        const data = {
          organization: this.$store?.state?.user?.user?.owner_email,
          user_uid: this.$store?.state?.user?.user?.current_user_uid
        }
        let reglaments = []
        this.$store.commit(NAVIGATOR_REQUEST)
        this.$store.dispatch('REGLAMENTS_REQUEST', data).then(resp => {
          reglaments = resp.data
        }).finally(() => {
          this.$store.dispatch(NAVIGATOR_REQUEST).then(() => {
            this.storeNavigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            initWebSync()
            initInspectorSocket()
          })
        })
      }
    },
    getTask (uid) {
      if (this.$store.state.auth.token) {
        this.$store.dispatch(TASK.ONE_TASK_REQUEST, uid).then((resp) => {
          const navElem = {
            name: 'Поиск',
            key: 'taskListSource',
            value: {
              uid: '47a38aa5-19c4-40d0-b8c0-56c3a420935d',
              param: uid
            }
          }
          this.$store.commit('updateStackWithInitValue', navElem)
          this.$store.commit('basic', {
            key: 'mainSectionState',
            value: 'tasks'
          })
          this.$store.commit('basic', {
            key: 'taskListSource',
            value: navElem.value
          })

          this.$store.commit('basic', {
            key: 'propertiesState',
            value: 'task'
          })

          if (resp.data.tasks.length > 0) {
            this.$store.dispatch(TASK.SELECT_TASK, resp.data.tasks[0])
            if (!this.isPropertiesMobileExpanded) {
              this.$store.dispatch('asidePropertiesToggle', true)
            }
          }
          window.history.replaceState(null, null, '/')
        })
      }
    },
    getTasks () {
      if (this.$store.state.auth.token) {
        if (this.navStack.length && this.navStack.length > 0) {
          if (this.navStack[this.navStack.length - 1].key === 'taskListSource') {
            const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].value.uid]
            if (!action) {
              console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].uid)
              return
            }
            this.$store.dispatch(action, this.navStack[this.navStack.length - 1].value.param)
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'tasks'
            })
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1].key,
              value: this.navStack[this.navStack.length - 1].value
            })
          }
        } else {
          this.$store.commit('basic', {
            key: 'taskListSource',
            value: {
              uid: '901841d9-0016-491d-ad66-8ee42d2b496b',
              param: null
            }
          })
          this.$store.commit(
            'updateStackWithInitValue',
            {
              name: 'Сегодня',
              key: 'taskListSource',
              type: 'date',
              typeVal: new Date(),
              value: {
                uid: '901841d9-0016-491d-ad66-8ee42d2b496b',
                param: new Date()
              }
            }
          )
          this.$store.dispatch(TASK.TASKS_REQUEST, new Date())
            .then(() => {
              this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
            })
            .catch((err) => console.log(err))
        }
      }
    }
  }
}

</script>

<template>
  <Tabs
    v-if="$store.state.auth.token"
    class="fixed left-0 top-0 z-[50] ml-3"
  />
  <AsideMenu
    v-if="lastTab != '1' && lastTab != '4' && lastTab != '5'"
    :menu="menu"
  />
  <router-view />
</template>
