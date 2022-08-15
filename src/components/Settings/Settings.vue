<template>
  <AsideMenu :menu="menu" />
  <div>
    <Account
      v-if="currentSettingsTab === 'account'"
      @currentSettingsTab="changeSettingsTab ('tarif')"
      @AccLogout="logout()"
    />
    <Tarif
      v-if="currentSettingsTab === 'tarif'"
    />
    <Options
      v-if="currentSettingsTab === 'option'"
    />
    <acc-karma
      v-if="currentSettingsTab === 'karma'"
    />
  </div>
</template>
<script>
import AccKarma from '@/components/AccKarma.vue'
import Tarif from '@/components/Settings/Tarif.vue'
import Options from '@/components/Settings/Options.vue'
import Account from '@/components/Settings/Account.vue'
import AsideMenu from '@/components/AsideMenu.vue'

import { USER_REQUEST } from '@/store/actions/user'
import { AUTH_LOGOUT } from '@/store/actions/auth'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'

import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

export default {
  components: {
    AccKarma,
    AsideMenu,
    Tarif,
    Options,
    Account
  },
  computed: {
    currentSettingsTab () {
      return this.$store.state.navigator.currentSettingsTab
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    menu () {
      return this.$store.state.navigator.menu
    }
  },
  mounted () {
    const navLoaded = this.$store.state.navigator.hasLoadedOnce
    const userLoaded = this.$store.state.user.hasLoadedOnce

    // сначала запрашиваем пользователя, потом регламенты, потом навигатор
    if (!userLoaded || !navLoaded) {
      this.$store.commit(NAVIGATOR_REQUEST)
      this.$store.dispatch(USER_REQUEST).then(() => {
        // запрос регламентов
        const data = {
          organization: this.$store?.state?.user?.user?.owner_email,
          user_uid: this.$store?.state?.user?.user?.current_user_uid
        }
        let reglaments = []
        this.$store.dispatch('REGLAMENTS_REQUEST', data).then(resp => {
          reglaments = resp.data
        }).finally(() => {
          // запрос навигатора
          this.$store.dispatch(NAVIGATOR_REQUEST).then((resp) => {
            this.$store.state.navigator.navigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            try {
              initWebSync()
              initInspectorSocket()
            } catch (e) {}
          })
        })
      })
    }
  },
  methods: {
    logout () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        localStorage.setItem('currentSettingsTab', 'account')
        this.$router.push('/login')
      })
      if (this.isPropertiesMobileExpanded) { this.$store.dispatch('asidePropertiesToggle', false) }
    },
    changeSettingsTab (tabName) {
      localStorage.setItem('currentSettingsTab', tabName)
      this.$store.state.navigator.currentSettingsTab = tabName
    }
  }
}
</script>
<style>
</style>
