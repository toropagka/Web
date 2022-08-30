<template>
  <MainMenu
    v-if="!isFileRedirect && token"
    class="fixed"
  />
  <SubMenu
    v-if="isSubMenuActive"
  >
    <SettingsSubmenu
      v-if="lastTab === 'settings'"
    />
    <DirectorySubmenu
      v-if="lastTab === 'directory'"
    />
    <TasksSubmenu
      v-if="lastTab === 'tasks'"
    />
    <BoardsSubmenu
      v-if="lastTab === 'new_private_boards'"
    />
    <ProjectsSubmenu
      v-if="lastTab === 'new_private_projects'"
    />
  </SubMenu>
  <overlay
    v-show="isSubMenuActive"
    :z-index="'z-20'"
    @overlay-click="closeSubMenu"
  />
</template>
<script>
import MainMenu from '@/components/AsideMenu/MainMenu.vue'
import TasksSubmenu from '@/components/AsideMenu/TasksSubmenu.vue'
import DirectorySubmenu from '@/components/AsideMenu/DirectorySubmenu.vue'
import ProjectsSubmenu from '@/components/AsideMenu/ProjectsSubmenu.vue'
import SubMenu from '@/components/AsideMenu/SubMenu.vue'
import BoardsSubmenu from '@/components/AsideMenu/BoardsSubmenu.vue'
import SettingsSubmenu from '@/components/AsideMenu/SettingsSubmenu.vue'
import Overlay from '@/components/modals/Overlay.vue'

export default {
  components: {
    MainMenu,
    TasksSubmenu,
    DirectorySubmenu,
    ProjectsSubmenu,
    SubMenu,
    BoardsSubmenu,
    SettingsSubmenu,
    Overlay
  },
  computed: {
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    isSubMenuActive () {
      return this.$store.state.navigator.submenu.status
    },
    isFileRedirect () {
      return (this.$router.currentRoute.value.name === 'taskfile' || this.$router.currentRoute.value.name === 'cardfile') && this.$router.currentRoute.value.params.id
    },
    token () {
      return this.$store.state.auth.token
    }
  }
}
</script>
