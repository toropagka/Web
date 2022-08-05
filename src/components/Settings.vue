<template>
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
</template>
<script>
import AccKarma from '@/components/AccKarma.vue'
import AccTarif from '@/components/AccTarif.vue'
import AccOption from '@/components/AccOption.vue'
import AccModal from '@/components/AccModal.vue'
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
  methods: {
    logout () {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/')
      })
      if (this.isPropertiesMobileExpanded) { this.$store.dispatch('asidePropertiesToggle', false) }
    },
    changeSettingsTab (tabName) {
      console.log(this.$store.state.navigator.currentSettingsTab)
      this.$store.state.navigator.currentSettingsTab = tabName
    }
  }
}
</script>
<style>
</style>
