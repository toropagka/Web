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

import { setLocalStorageItem } from '@/store/helpers/functions'
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
