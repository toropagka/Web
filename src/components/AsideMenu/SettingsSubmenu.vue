<template>
  <div
    style="overflow-x:hidden; scrollbar-width: none;"
    class="w-[292px] fixed top-0 pt-[15px] z-30 h-screen transition-position bg-[#f4f5f7] font-SfProDisplayNormal text-sm"
  >
    <AsideMenuSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <div class="my-[10px]">
        <template
          v-for="(menuGroup, index) in menu"
          :key="`b-${index}`"
        >
          <AsideMenuList
            :menu="menuGroup"
            @menu-click="menuClick"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'
import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'

export default {
  components: {
    AsideMenuSkeleton,
    AsideMenuList
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  emits: ['closeSubMenu'],
  computed: {
    currentSettingsTab () {
      return this.$store.state.navigator.currentSettingsTab
    },
    status () {
      return this.$store.state.navigator.status
    }
  },
  methods: {
    menuClick (event, item) {
      this.$store.state.navigator.currentSettingsTab = item.type
      const navElem = {
        name: item.label,
        key: 'greedSource',
        value: { uid: item.uid, param: null },
        greedPath: item.type
      }
      localStorage.setItem('currentSettingsTab', item.type)
      localStorage.setItem('lastTab', 'settings')
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$emit('closeSubMenu')
    }
  }
}
</script>
