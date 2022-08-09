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
    if (!navLoaded) {
      this.$store.dispatch(NAVIGATOR_REQUEST)
    }
    if (!userLoaded) {
      this.$store.dispatch(USER_REQUEST)
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
