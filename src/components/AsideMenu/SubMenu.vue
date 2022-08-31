<template>
  <div
    style="overflow-x:hidden; scrollbar-width: none;"
    class="scroll-style w-[292px] fixed top-0 z-30 h-screen transition-position bg-[#f4f5f7] left-[292px] font-SfProDisplayNormal text-sm"
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
  </div>
</template>

<script>
import BoardsSubmenu from '@/components/AsideMenu/BoardsSubmenu.vue'
import SettingsSubmenu from '@/components/AsideMenu/SettingsSubmenu.vue'
import TasksSubmenu from '@/components/AsideMenu/TasksSubmenu.vue'
import DirectorySubmenu from '@/components/AsideMenu/DirectorySubmenu.vue'
import ProjectsSubmenu from '@/components/AsideMenu/ProjectsSubmenu.vue'

export default {
  components: {
    TasksSubmenu,
    SettingsSubmenu,
    DirectorySubmenu,
    BoardsSubmenu,
    ProjectsSubmenu
  },
  computed: {
    lastTab () {
      return this.$store.state.navigator.lastTab
    }
  }
}
</script>
