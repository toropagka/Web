<template>
  <modal-box-notification-instruction
    v-model="shouldShowModalBox"
    button="warning"
    has-button
    has-cancel
    button-label="Хорошо, я понял"
    @confirm="setShouldShowModalValue('0')"
  >
    <p>
      Мы используем системные уведомления для отображения важных событий в приложении, которые нельзя увидеть при свернутом браузере или в другой вкладке.
    </p>
    <p>
      Чтобы всегда быть в курсе актуального положения дел, пожалуйста, разрешите отображение уведомлений в настройках браузера.
    </p>
    <p>
      Инстрyкции как включить уведомления для разных браузеров:
    </p>
    <a
      href="https://support.google.com/chrome/answer/3220216?hl=ru&co=GENIE.Platform%3DAndroid"
      target="_blank"
      class="text-blue-400"
    >Google Chrome</a>
    <br>
    <a
      href="https://support.apple.com/ru-ru/guide/safari/sfri40734/mac"
      target="_blank"
      class="text-blue-400"
    >Safari</a>
    <br>
    <a
      href="https://sendpulse.com/ru/knowledge-base/push-notifications/enable-disable-push-notifications-mozilla-firefox"
      target="_blank"
      class="text-blue-400"
    >Firefox</a>
  </modal-box-notification-instruction>
  <ModalBox
    v-if="showInviteModalBox"
    title="Вас пригласили в компанию"
    ok="Принять"
    decline="Отказаться"
    @ok="okInviteModalBox"
    @decline="declineInviteModalBox"
    @cancel="cancelInviteModalBox"
  />
  <main-section class="h-full">
    <MainMenu
      v-if="!isFileRedirect && $store.state.auth.token"
      class="fixed"
    />
    <SubMenu
      v-if="isSubMenuActive"
    />
    <overlay
      v-show="isSubMenuActive"
      :z-index="'z-20'"
      @overlay-click="closeSubMenu"
    />
    <overlay
      v-if="!isFileRedirect"
      v-show="isAsideLgActive"
      :z-index="'z-20'"
      @overlay-click="overlayClick"
    />
    <properties-right v-if="!isFileRedirect" />
    <ErrorNotification v-if="!isFileRedirect" />
    <Notification v-if="!isFileRedirect" />
    <InspectorNotification v-if="!isFileRedirect" />
    <slot />
  </main-section>
</template>

<script>
import MainMenu from '@/components/AsideMenu/MainMenu.vue'
import SubMenu from '@/components/AsideMenu/SubMenu.vue'
import Overlay from '@/components/modals/Overlay.vue'

import { setLocalStorageItem, UID_TO_ACTION, visitChildren } from '@/store/helpers/functions'
import PropertiesRight from '@/components/PropertiesRight.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'
import Notification from '@/components/Notifications/Notification.vue'
import InspectorNotification from '@/components/Notifications/InspectorNotification.vue'
import ModalBox from '@/components/modals/ModalBox.vue'

import MainSection from '@/components/MainSection.vue'
import ModalBoxNotificationInstruction from '@/components/modals/ModalBoxNotificationInstruction.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_INVITE_ME } from '@/store/actions/user'

import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

export default {
  components: {
    MainMenu,
    SubMenu,
    ModalBoxNotificationInstruction,
    MainSection,
    Overlay,
    PropertiesRight,
    ErrorNotification,
    Notification,
    InspectorNotification,
    ModalBox
  },
  data () {
    return {
      shouldShowModalBox: false
    }
  },
  computed: {
    mainSectionState () {
      return this.$store.state.mainSectionState
    },
    isSubMenuActive () {
      return this.$store.state.navigator.submenu.status
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    greedPath () {
      return this.$store.state.greedPath
    },
    greedSource () {
      return this.$store.state.greedSource
    },
    isAsideLgActive () {
      return this.$store.state.isAsideLgActive
    },
    isFileRedirect () {
      return (this.$router.currentRoute.value.name === 'taskfile' || this.$router.currentRoute.value.name === 'cardfile') && this.$router.currentRoute.value.params.id
    },
    menu () {
      return this.$store.state.navigator.menu
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    showInviteModalBox () {
      if (this.$store.state.navigator.navigator?.invite_me?.uid && this.$store.state.navigator.navigator?.invite_me?.uid !== '00000000-0000-0000-0000-000000000000') return true
      return false
    }
  },
  mounted () {
    this.initNavStackGreedView()
  },
  methods: {
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    },
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
          this.$store.dispatch(NAVIGATOR_REQUEST).then((resp) => {
            console.log(resp.data)
            this.storeNavigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            this.initNavStackGreedView()
            try {
              initWebSync()
              initInspectorSocket()
            } catch (e) {}
          })
        })
      }
    },
    setShouldShowModalValue (value) {
      setLocalStorageItem('shouldShowModal', value)
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          setLocalStorageItem('shouldShowModal', '0')
        } else if (permission === 'denied') {
          setLocalStorageItem('shouldShowModal', '0')
        }
      })
    },
    requestNotificationPermissionOrShowModalBox () {
      if (parseInt(localStorage.getItem('shouldShowModal')) === 0) {
        return
      }

      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'granted') {
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'default') {
        setLocalStorageItem('shouldShowModal', '1')
      } else if (Notification.permission === 'denied') { // handle denied case
        setLocalStorageItem('shouldShowModal', '1')
      }

      if (parseInt(localStorage.getItem('shouldShowModal')) === 1) {
        this.shouldShowModalBox = true
      }
    },
    overlayClick () {
      this.$store.dispatch('asideLgToggle', false)
    },
    initNavStackWithFoundProjects (projectUid) {
      let project
      visitChildren(this.storeNavigator.new_private_projects[0].items, value => {
        if (value.uid === projectUid) {
          project = value
        }
      })
      visitChildren(this.storeNavigator.new_private_projects[1].items, value => {
        if (value.uid === projectUid) {
          project = value
        }
      })

      const navElem = {
        name: project.name,
        key: 'greedSource',
        uid: project.uid,
        global_property_uid: project.global_property_uid,
        greedPath: 'projects_children',
        value: project.children
      }
      this.$store.commit('pushIntoNavStack', navElem)
    },
    initNavStackWithFoundBoards (boardUid) {
      let board
      visitChildren(this.storeNavigator.new_private_boards[0].items, value => {
        if (value.uid === boardUid) {
          board = value
        }
      })
      visitChildren(this.storeNavigator.new_private_boards[1].items, value => {
        if (value.uid === boardUid) {
          board = value
        }
      })

      const navElem = {
        name: board.name,
        key: 'greedSource',
        uid: board.uid,
        global_property_uid: board.global_property_uid,
        greedPath: 'boards_children',
        value: board.children
      }
      this.$store.commit('pushIntoNavStack', navElem)
    },
    initNavStackWithFoundReglaments (reglamentUid) {
      let reglament
      visitChildren(this.storeNavigator.reglaments.items, value => {
        if (value.uid === reglamentUid) {
          reglament = value
        }
      })

      const navElem = {
        name: reglament.name,
        key: 'greedSource',
        uid: reglamentUid,
        global_property_uid: reglament.global_property_uid,
        greedPath: 'reglament_content',
        value: reglament.children
      }
      this.$store.commit('pushIntoNavStack', navElem)
    },
    getProject (uid) {
      const navElem = {
        name: 'Проекты',
        key: 'greedSource',
        greedPath: 'new_private_projects',
        value: this.storeNavigator.new_private_projects
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundProjects(uid)
      window.history.replaceState(null, null, '/')
    },
    getBoard (uid) {
      const navElem = {
        name: 'Доски',
        key: 'greedSource',
        greedPath: 'new_private_boards',
        value: this.storeNavigator.new_private_boards
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundBoards(uid)
      window.history.replaceState(null, null, '/')
    },
    getReglamentByLink (uid) {
      const navElem = {
        name: 'Регламенты',
        key: 'greedSource',
        greedPath: 'reglament_content',
        value: this.storeNavigator.reglaments.uid
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.initNavStackWithFoundReglaments(uid)
      window.history.replaceState(null, null, '/')
    },
    initNavStackGreedView () {
      if (this.$router.currentRoute.value.name === 'project' && this.$router.currentRoute.value.params.id) {
        this.getProject(this.$router.currentRoute.value.params.id)
      }
      if (this.$router.currentRoute.value.name === 'board' && this.$router.currentRoute.value.params.id) {
        this.getBoard(this.$router.currentRoute.value.params.id)
      }
      if (this.$router.currentRoute.value.name === 'reglament' && this.$router.currentRoute.value.params.id) {
        this.getReglamentByLink(this.$router.currentRoute.value.params.id)
      }
      // After navigator is loaded we are trying to set up last visited navElement
      // Checking if last navElement is a gridSource
      if (this.navStack.length && this.navStack.length > 0) {
        if (this.navStack[this.navStack.length - 1].key === 'greedSource') {
          const navStackUid = this.navStack[this.navStack.length - 1]?.uid
          if (navStackUid === '2cf6b167-6506-4b05-bc34-70a8d88e3b25') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'doitnow'
            })
          } else if (navStackUid === 'ed8039ae-f3de-4369-8f32-829d401056e9') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'colors'
            })
          } else if (navStackUid === '00a5b3de-9474-404d-b3ba-83f488ac6d30') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'tags'
            })
          } else if (navStackUid === '757be87d-c269-40e0-b224-6b2bb0e4f97d') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'other'
            })
          } else if (navStackUid === 'asfctmui-u70g-z7qr-1l1j-6zvud6yc255l') {
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
            this.$store.commit('basic', {
              key: 'greedPath',
              value: 'notifications'
            })
          } else {
            this.$store.commit('basic', {
              key: 'greedPath',
              value: this.navStack[this.navStack.length - 1].greedPath
            })
            this.$store.commit('basic', {
              key: 'mainSectionState',
              value: 'greed'
            })
          }

          // If last navElement is related to processed navigator instance with 'new_' prefix
          // then we pass entire object from storeNavigator
          if (['new_private_projects', 'new_emps', 'new_delegate', 'new_private_boards'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1].key,
              value: this.storeNavigator[this.navStack[this.navStack.length - 1].greedPath]
            })

            // if last visited navElemen is in nested in children, then we trying to find these children with visitChildren fucntion
            // from storeNavigator
          } else if (['tags_children', 'projects_children', 'boards_children', 'reglament_content'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
            if (['tags_children', 'projects_children', 'boards_children'].includes(this.navStack[this.navStack.length - 1].greedPath)) {
              const pathToNavigatorItem = {
                tags_children: 'tags',
                projects_children: 'new_private_projects',
                boards_children: 'new_private_boards'
              }
              const action = UID_TO_ACTION[this.navStack[this.navStack.length - 1].global_property_uid]
              if (!action) {
                console.error('UID_TO_ACTION in undefined', this.navStack[this.navStack.length - 1].global_property_uid)
                return
              }

              this.$store.dispatch(action, this.navStack[this.navStack.length - 1].uid)
              this.$store.commit('basic', {
                key: 'taskListSource',
                value: {
                  uid: this.navStack[this.navStack.length - 1].global_property_uid,
                  param: this.navStack[this.navStack.length - 1].uid
                }
              })

              // мы здесь смотрим, если у нас элемент из навигатора это массив по типу как projects или boards, мы идем по этому массиву и пытаемся найти детей
              if (Array.isArray(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]])) {
                for (let i = 0; i < this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]].length; i++) {
                  visitChildren(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]][i].items, value => {
                    if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                      this.$store.commit('basic', {
                        key: this.navStack[this.navStack.length - 1].key,
                        value: value.children
                      })
                    }
                  })
                }
              } else {
                visitChildren(this.storeNavigator[pathToNavigatorItem[this.navStack[this.navStack.length - 1].greedPath]].items, value => {
                  if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                    this.$store.commit('basic', {
                      key: this.navStack[this.navStack.length - 1].key,
                      value: value.children
                    })
                  }
                })
              }
            }
            if (this.navStack[this.navStack.length - 1].greedPath === 'reglament_content') {
              visitChildren(this.storeNavigator.reglaments.items, value => {
                if (value.uid === this.navStack[this.navStack.length - 1].uid) {
                  this.$store.commit('basic', {
                    key: this.navStack[this.navStack.length - 1].key,
                    value: value
                  })
                }
              })
            }
          } else {
            // colors and reglaments
            this.$store.commit('basic', {
              key: this.navStack[this.navStack.length - 1]?.key,
              value: this.storeNavigator[this.navStack[this.navStack.length - 1]?.greedPath]?.items
            })
          }
        }
      }
    },
    okInviteModalBox () {
      const data = {
        uid: this.$store.state.navigator.navigator?.invite_me?.uid,
        accept: true
      }
      this.$store.dispatch(USER_INVITE_ME, data)
        .then(() => {
          this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
          location.reload()
        })
    },
    declineInviteModalBox () {
      const data = {
        uid: this.$store.state.navigator.navigator?.invite_me?.uid,
        accept: false
      }
      this.$store.dispatch(USER_INVITE_ME, data)
      this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
    },
    cancelInviteModalBox () {
      this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
    }
  }
}
</script>
