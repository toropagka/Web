<script>
import MainMenu from '@/components/AsideMenu/MainMenu.vue'
import TasksSubmenu from '@/components/AsideMenu/TasksSubmenu.vue'
import DirectorySubmenu from '@/components/AsideMenu/DirectorySubmenu.vue'
import ProjectsSubmenu from '@/components/AsideMenu/ProjectsSubmenu.vue'
import SubMenu from '@/components/AsideMenu/SubMenu.vue'
import BoardsSubmenu from '@/components/AsideMenu/BoardsSubmenu.vue'
import SettingsSubmenu from '@/components/AsideMenu/SettingsSubmenu.vue'
import Overlay from '@/components/modals/Overlay.vue'

// очищаем консоль - по идее выше ошибки которые
// мы не можем поправить из fm.websync и fm.min
// по этому консоль очищаем
export default {
  components: {
    MainMenu,
    TasksSubmenu,
    SettingsSubmenu,
    DirectorySubmenu,
    Overlay,
    ProjectsSubmenu,
    SubMenu,
    BoardsSubmenu
  },
  computed: {
    menu () {
      return this.$store.state.navigator.menu
    },
    isSubMenuActive () {
      return this.$store.state.navigator.submenu.status
    },
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    navStack () {
      return this.$store.state.navbar.navStack
    },
    isFileRedirect () {
      return (this.$router.currentRoute.value.name === 'taskfile' || this.$router.currentRoute.value.name === 'cardfile') && this.$router.currentRoute.value.params.id
    }
  },
  mounted () {
    console.clear()
    const fm = document.createElement('script')
    fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
    fm.onload = () => {
      // подключаем скрыпты в правильном порядке - сначала fm.min потом fm.websync.min
      const websync = document.createElement('script')
      websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
      document.head.appendChild(websync)
    }
    document.head.appendChild(fm)
  },
  methods: {
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    }
  }
}

</script>

<template>
  <MainMenu
    v-if="!isFileRedirect && $store.state.auth.token"
    class="fixed"
  />
  <SubMenu
    v-if="isSubMenuActive"
    @closeSubMenu="closeSubMenu"
  >
    <SettingsSubmenu
      v-if="lastTab === 'settings'"
      :menu="menu"
      @closeSubMenu="closeSubMenu"
    />
    <DirectorySubmenu
      v-if="lastTab === 'directory'"
      :menu="menu"
    />
    <TasksSubmenu
      v-if="lastTab === 'tasks'"
      :menu="menu"
      @closeSubMenu="closeSubMenu"
    />
    <BoardsSubmenu
      v-if="lastTab === 'new_private_boards'"
      :items="storeNavigator[lastTab]"
      @closeSubMenu="closeSubMenu"
    />
    <ProjectsSubmenu
      v-if="lastTab === 'new_private_projects'"
      :items="storeNavigator[lastTab]"
      @closeSubMenu="closeSubMenu"
    />
  </SubMenu>
  <overlay
    v-show="isSubMenuActive"
    :z-index="'z-20'"
    @overlay-click="closeSubMenu"
  />
  <router-view />
</template>
