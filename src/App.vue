<script>
import MainMenu from '@/components/AsideMenu/MainMenu.vue'
import TasksSubmenu from '@/components/AsideMenu/TasksSubmenu.vue'
import DirectorySubmenu from '@/components/AsideMenu/DirectorySubmenu.vue'
import ProjectsSubmenu from '@/components/AsideMenu/ProjectsSubmenu.vue'
import SubMenu from '@/components/AsideMenu/SubMenu.vue'
import BoardsSubmenu from '@/components/AsideMenu/BoardsSubmenu.vue'
import SettingsSubmenu from '@/components/AsideMenu/SettingsSubmenu.vue'
import Overlay from '@/components/modals/Overlay.vue'
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'

import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

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
    BoardsSubmenu,
    AsideMenuSkeleton
  },
  data () {
    return {
      isContentLoaded: false
    }
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

    const userLoaded = this.$store.state.user.hasLoadedOnce
    const navLoaded = this.$store.state.navigator.hasLoadedOnce
    if (!userLoaded && !navLoaded) {
      this.$store.dispatch(USER_REQUEST).then(resp => {
        this.$store.dispatch('GET_SOUND_SETTING', resp.data.current_user_uid)
        this.getNavigator()
        if (this.$router.currentRoute.value.name === 'task' && this.$router.currentRoute.value.params.id) {
          this.getTask(this.$router.currentRoute.value.params.id)
        } else {
          if (localStorage.getItem('lastTab') === 'tasks') {
            this.getTasks()
          }
        }
      })
    } else {
      this.isContentLoaded = true
    }
  },
  methods: {
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    },
    getNavigator () {
      if (this.$store.state.auth.token) {
        const data = {
          organization: this.$store?.state?.user?.user?.owner_email,
          user_uid: this.$store?.state?.user?.user?.current_user_uid
        }
        let reglaments = []
        this.$store.commit(NAVIGATOR_REQUEST)
        this.$store.dispatch('REGLAMENTS_REQUEST', data).then(resp => {
          reglaments = resp.data
        }).finally(() => {
          this.$store.dispatch(NAVIGATOR_REQUEST).then((resp) => {
            this.storeNavigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            try {
              initWebSync()
              initInspectorSocket()
            } catch (e) {}
            this.isContentLoaded = true
          })
        })
      }
    }
  }
}

</script>

<template>
  <template v-if="isContentLoaded">
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
  <AsideMenuSkeleton
    v-else
  />
</template>
