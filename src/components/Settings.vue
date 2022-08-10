<template>
  <div class="mt-[30px]">
    <acc-modal
      v-if="currentSettingsTab === 'account'"
      @currentSettingsTab="changeSettingsTab ('tarif')"
      @AccLogout="logout()"
    />
    <acc-tarif
      v-if="currentSettingsTab === 'tarif'"
    />
    <acc-option
      v-if="currentSettingsTab === 'option'"
    />
    <acc-karma
      v-if="currentSettingsTab === 'karma'"
    />
  </div>
</template>
<script>
import AccKarma from '@/components/AccKarma.vue'
import AccTarif from '@/components/AccTarif.vue'
import AccOption from '@/components/AccOption.vue'
import AccModal from '@/components/AccModal.vue'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'
import { USER_REQUEST } from '@/store/actions/user'
import { AUTH_LOGOUT } from '@/store/actions/auth'
export default {
  components: {
    AccKarma,
    AccTarif,
    AccOption,
    AccModal
  },
  computed: {
    currentSettingsTab () {
      return this.$store.state.navigator.currentSettingsTab
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  mounted () {
    const navLoaded = this.$store.state.navigator.hasLoadedOnce
    const userLoaded = this.$store.state.user.hasLoadedOnce

    // сначала запрашиваем пользователя, потом регламенты, потом навигатор
    if (!userLoaded || !navLoaded) {
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
        this.$router.push('/login')
      })
      if (this.isPropertiesMobileExpanded) { this.$store.dispatch('asidePropertiesToggle', false) }
    },
    changeSettingsTab (tabName) {
      this.$store.state.navigator.currentSettingsTab = tabName
    }
  }
}
</script>
<style>
</style>
