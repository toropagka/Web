<template>
  <div
    style="overflow-x:hidden; scrollbar-width: none;"
    class="scroll-style w-[292px] fixed top-0 z-30 h-screen transition-position bg-[#f4f5f7] left-[292px] font-SfProDisplayNormal text-sm"
  >
    <AccountSubmenu
      v-if="activeTab === 'account'"
    />
    <SettingsSubmenu
      v-if="activeTab === 'settings'"
    />
    <TasksSubmenu
      v-if="activeTab === 'tasks'"
    />
    <BoardsSubmenu
      v-if="activeTab === 'board'"
    />
    <ProjectsSubmenu
      v-if="activeTab === 'project'"
    />
  </div>
</template>

<script>
import BoardsSubmenu from '@/components/AsideMenu/BoardsSubmenu.vue'
import TasksSubmenu from '@/components/AsideMenu/TasksSubmenu.vue'
import SettingsSubmenu from '@/components/AsideMenu/SettingsSubmenu.vue'
import ProjectsSubmenu from '@/components/AsideMenu/ProjectsSubmenu.vue'
import AccountSubmenu from '@/components/AsideMenu/AccountSubmenu.vue'

export default {
  components: {
    TasksSubmenu,
    SettingsSubmenu,
    AccountSubmenu,
    BoardsSubmenu,
    ProjectsSubmenu
  },
  computed: {
    activeTab () {
      return this.$store.state.navigator.submenu.activeTab
    }
  }
}
</script>
