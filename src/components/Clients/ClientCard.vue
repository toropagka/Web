<template>
  <ListBlocItem
    :title="client.name"
    :sub-title="client.email ? client.email: client.phone"
  />
</template>

<script>
import ListBlocItem from '@/components/Common/ListBlocItem.vue'

export default {
  components: {
    ListBlocItem
  },
  props: {
    client: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>
