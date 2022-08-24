<template>
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
    <Support
      v-if="currentSettingsTab === 'support'"
    />
  </div>
</template>
<script>
import AccKarma from '@/components/AccKarma.vue'
import Tarif from '@/components/Settings/Tarif.vue'
import Options from '@/components/Settings/Options.vue'
import Account from '@/components/Settings/Account.vue'
import Support from '@/components/Settings/Support.vue'

import { AUTH_LOGOUT } from '@/store/actions/auth'

export default {
  components: {
    AccKarma,
    Tarif,
    Options,
    Account,
    Support
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
    },
    user () {
      return this.$store.state.user.user
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
