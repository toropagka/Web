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
    }
  }
}
</script>
<style>
</style>
