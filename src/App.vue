<template>
  <template v-if="isContentLoaded">
    <!-- TODO: Перенести MainMenu в Home.vue, здесь оставить чистую страницу для компонентов вроде TaskFile.vue, CardFile.vue, которым нужен чистый экран -->
    <component
      :is="$route.meta.layout || 'div'"
      class="h-screen"
    >
      <router-view />
    </component>
  </template>
  <AppSkeleton v-else />
</template>
<script>

import AppSkeleton from '@/AppSkeleton.vue'

import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'
import { USER_REQUEST } from '@/store/actions/user'
import { setLocalStorageItem } from '@/store/helpers/functions'

import initWebSync from '@/websync/index.js'
import initInspectorSocket from '@/inspector/index.js'

export default {
  components: {
    AppSkeleton
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
      return (this.$route.name === 'taskfile' || this.$route.name === 'cardfile') && this.$route.params.id
    },
    isAuth () {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuth (newval, oldval) {
      location.reload()
    }
  },
  mounted () {
    if (this.ifFileRedirect) {
      this.isContentLoaded = true
    } else {
      this.initApplication()
    }
  },
  methods: {
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    },
    checkCidParam () {
      // здесь не использую this.$router, потому что не получилось нормально достать url param
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      if (params.cid) {
        setLocalStorageItem('cid', params.cid)
      }
    },
    initApplication () {
      // очищаем консоль - по идее выше ошибки которые
      // мы не можем поправить из fm.websync и fm.min
      // по этому консоль очищаем
      console.clear()

      this.checkCidParam()

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
        this.$store.dispatch(USER_REQUEST)
          .then(resp => {
            this.$store.dispatch('GET_SOUND_SETTING', resp.data.current_user_uid)
            this.getNavigator()
          })
          .catch(() => {
            this.isContentLoaded = true
          })
      } else {
        this.isContentLoaded = true
      }
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
