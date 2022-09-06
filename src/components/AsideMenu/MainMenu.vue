<template>
  <InspectorLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />
  <InspectorModalBox
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
  />
  <aside
    id="aside"
    style="overflow-x:hidden; scrollbar-width: none;"
    class="w-[292px] fixed top-0 z-30 h-screen transition-position bg-[#f4f5f7] font-SfProDisplayNormal text-sm xl:left-0"
    :class="isAsideMobileExpanded ? 'left-0' : '-left-full'"
  >
    <div class="px-[16px] pt-[15px]">
      <AsideMenuListItem
        class="mb-[16px]"
        :selected="isPathSelected('settings')"
        :title="user?.current_user_name"
        @click="gotoSettings"
      >
        <img
          class="rounded-[8px] h-[30px] w-[30px] border-2 border-white"
          :src="user?.foto_link"
        >
      </AsideMenuListItem>
      <AsideMenuListItem
        :selected="isPathSelected('doitnow')"
        title="Очередь"
        @click="gotoDoitnow"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 6.89471C5 6.65742 5.08975 6.42985 5.2495 6.26206C5.40925 6.09426 5.62593 6 5.85185 6H22.5926C22.8185 6 23.0352 6.09426 23.1949 6.26206C23.3547 6.42985 23.4444 6.65742 23.4444 6.89471C23.4444 7.13201 23.3547 7.35958 23.1949 7.52737C23.0352 7.69517 22.8185 7.78943 22.5926 7.78943H5.85185C5.62593 7.78943 5.40925 7.69517 5.2495 7.52737C5.08975 7.35958 5 7.13201 5 6.89471ZM14.0741 13.1577H5.85185C5.62593 13.1577 5.40925 13.252 5.2495 13.4198C5.08975 13.5876 5 13.8151 5 14.0524C5 14.2897 5.08975 14.5173 5.2495 14.6851C5.40925 14.8529 5.62593 14.9471 5.85185 14.9471H14.0741C14.3 14.9471 14.5167 14.8529 14.6764 14.6851C14.8362 14.5173 14.9259 14.2897 14.9259 14.0524C14.9259 13.8151 14.8362 13.5876 14.6764 13.4198C14.5167 13.252 14.3 13.1577 14.0741 13.1577ZM14.0741 20.3154H5.85185C5.62593 20.3154 5.40925 20.4097 5.2495 20.5775C5.08975 20.7453 5 20.9729 5 21.2102C5 21.4474 5.08975 21.675 5.2495 21.8428C5.40925 22.0106 5.62593 22.1049 5.85185 22.1049H14.0741C14.3 22.1049 14.5167 22.0106 14.6764 21.8428C14.8362 21.675 14.9259 21.4474 14.9259 21.2102C14.9259 20.9729 14.8362 20.7453 14.6764 20.5775C14.5167 20.4097 14.3 20.3154 14.0741 20.3154ZM26 17.6313C26.0009 17.784 25.964 17.9343 25.8931 18.0676C25.8222 18.2009 25.7196 18.3126 25.5954 18.3918L18.7805 22.8654C18.6517 22.9494 18.5038 22.9958 18.3522 22.9997C18.2006 23.0037 18.0507 22.965 17.918 22.8877C17.7862 22.8091 17.6764 22.6953 17.5997 22.5578C17.5231 22.4204 17.4823 22.2642 17.4815 22.1049V13.1577C17.4816 12.9985 17.5222 12.8423 17.5991 12.7051C17.6759 12.5679 17.7862 12.4547 17.9186 12.3772C18.051 12.2997 18.2006 12.2607 18.3522 12.2642C18.5037 12.2677 18.6516 12.3136 18.7805 12.3972L25.5954 16.8708C25.7196 16.95 25.8222 17.0617 25.8931 17.195C25.964 17.3283 26.0009 17.4786 26 17.6313ZM23.5403 17.6313L19.1852 14.7682V20.4944L23.5403 17.6313Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <AsideMenuListItem
        :selected="isPathSelected('tasks')"
        title="Задачи"
        @click="gotoTasks"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.44542 5.83331H12.8532C13.1941 5.83331 13.4651 6.10431 13.4651 6.44524V12.853C13.4651 13.1939 13.1941 13.4649 12.8532 13.4649H6.44542C6.10449 13.4649 5.8335 13.1939 5.8335 12.853V6.44524C5.8335 6.10431 6.10449 5.83331 6.44542 5.83331ZM7.34583 7.34565V11.9526H11.9528V7.34565H7.34583ZM6.44542 16.035H12.8532C13.1941 16.035 13.4651 16.306 13.4651 16.647V23.0547C13.4651 23.3957 13.1941 23.6667 12.8532 23.6667H6.44542C6.10449 23.6667 5.8335 23.3957 5.8335 23.0547V16.647C5.8335 16.306 6.10449 16.035 6.44542 16.035ZM7.34583 17.5474V22.1543H11.9528V17.5474H7.34583ZM20.6071 16.035H19.0948V19.0947H16.0352V20.607H19.0948V23.6667H20.6071V20.607H23.6668V19.0947H20.6071V16.035ZM16.6471 5.83331H23.0548C23.3958 5.83331 23.6668 6.10431 23.6668 6.44524V12.853C23.6668 13.1939 23.3958 13.4649 23.0548 13.4649H16.6471C16.3062 13.4649 16.0352 13.1939 16.0352 12.853V6.44524C16.0352 6.10431 16.3062 5.83331 16.6471 5.83331ZM17.5475 7.34565V11.9526H22.1544V7.34565H17.5475Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <router-link
        to="/reglaments"
      >
        <AsideMenuListItem
          :selected="isPathSelected('reglaments')"
          title="Регламенты"
          @click="gotoReglaments"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.2803 18.4697L24.0303 16.2197C23.8896 16.0791 23.6989 16.0002 23.5 16.0002C23.3011 16.0002 23.1104 16.0791 22.9697 16.2197L16 23.1895V26.5H19.3105L26.2803 19.5303C26.4209 19.3896 26.4998 19.1989 26.4998 19C26.4998 18.8011 26.4209 18.6104 26.2803 18.4697ZM18.6895 25H17.5V23.8105L21.25 20.0605L22.4395 21.25L18.6895 25ZM23.5 20.1895L22.3105 19L23.5 17.8105L24.6895 19L23.5 20.1895ZM10 16H17.5V17.5H10V16ZM10 11.5H19V13H10V11.5Z"
              fill="currentColor"
            />
            <path
              d="M23.5 7C23.4996 6.6023 23.3414 6.221 23.0602 5.93978C22.779 5.65856 22.3977 5.5004 22 5.5H7.00001C6.6023 5.5004 6.221 5.65856 5.93978 5.93978C5.65856 6.221 5.5004 6.6023 5.50001 7V16.75C5.49833 18.2458 5.90404 19.7137 6.67359 20.9964C7.44313 22.279 8.54745 23.3278 9.868 24.0302L13.75 26.1002V24.4L10.5745 22.7065C9.49402 22.1318 8.59042 21.2737 7.96069 20.2243C7.33095 19.1749 6.99884 17.9738 7.00001 16.75V7H22V13.75H23.5V7Z"
              fill="currentColor"
            />
          </svg>
        </AsideMenuListItem>
      </router-link>
      <AsideMenuListItem
        :selected="isPathSelected('project')"
        title="Проекты"
        @click="gotoProjects"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.3813 9.4868V8.39736C23.3813 7.3868 22.5646 6.56356 21.562 6.56356H14.0645L13.8396 6.18891C13.7026 5.97201 13.463 5.83398 13.2087 5.83398H7.65284C6.65024 5.83398 5.8335 6.65722 5.8335 7.66779V21.5002C5.8335 22.5107 6.65024 23.334 7.65284 23.334H23.1808C24.1834 23.334 25.0001 22.5107 25.0001 21.5002V11.3107C25.005 10.3643 24.291 9.58539 23.3813 9.4868ZM7.31049 7.66779C7.31049 7.47553 7.46699 7.31779 7.65773 7.31779H12.7978L14.7933 10.6009C14.9253 10.8178 15.1649 10.9558 15.4242 10.9558H23.1906C23.3813 10.9558 23.5378 11.1136 23.5378 11.3058V21.5002C23.5378 21.6924 23.3813 21.8502 23.1906 21.8502H7.65284C7.4621 21.8502 7.3056 21.6924 7.3056 21.5002V7.66779H7.31049ZM21.9043 9.47201H15.8301L14.9644 8.04736H21.5571C21.7478 8.04736 21.9043 8.20511 21.9043 8.39736V9.47201Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <AsideMenuListItem
        :selected="isPathSelected('board')"
        title="Доски"
        @click="gotoBoards"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.5 24.9694C5.67347 24.9694 5 24.3061 5 23.4898V8.85714C5 8.04082 5.67347 7.37755 6.5 7.37755H10.102V6.32653C10.102 5.96939 10.3878 5.68367 10.7449 5.68367H12.7347L12.7857 5.55102C13.1122 4.62245 14.0102 4 15 4C15.9898 4 16.8878 4.62245 17.2143 5.55102L17.2653 5.68367H19.2551C19.6122 5.68367 19.898 5.96939 19.898 6.32653V7.37755H23.5C24.3265 7.37755 25 8.04082 25 8.85714V23.4898C25 24.3061 24.3265 24.9694 23.5 24.9694H6.5ZM6.29592 23.6939H23.7143V8.65306H19.898V9.70408C19.898 10.0612 19.6122 10.3469 19.2551 10.3469H10.7449C10.3878 10.3469 10.102 10.0612 10.102 9.70408V8.65306H6.29592V23.6939ZM11.398 9.06122H18.6122V6.96939H16.7041C16.3469 6.96939 16.0612 6.68367 16.0612 6.32653C16.0612 5.7449 15.5918 5.27551 15.0102 5.27551C14.4286 5.27551 13.949 5.7449 13.949 6.32653C13.949 6.68367 13.6633 6.96939 13.3061 6.96939H11.398V9.06122ZM19.1327 20.3571C18.7041 20.3571 18.3673 20.0102 18.3673 19.5918V18.6224C18.3673 18.1939 18.7143 17.8571 19.1327 17.8571H21.3163C21.7449 17.8571 22.0816 18.2041 22.0816 18.6224V19.5918C22.0816 20.0204 21.7347 20.3571 21.3163 20.3571H19.1327ZM14.0306 20.3571C13.6122 20.3571 13.2653 20.0102 13.2653 19.5918V18.6224C13.2653 18.1939 13.6122 17.8571 14.0306 17.8571H16.2143C16.6429 17.8571 16.9796 18.2041 16.9796 18.6224V19.5918C16.9796 20.0204 16.6327 20.3571 16.2143 20.3571H14.0306ZM8.68367 20.3571C8.2551 20.3571 7.91837 20.0102 7.91837 19.5918V18.6224C7.91837 18.1939 8.26531 17.8571 8.68367 17.8571H10.8673C11.2857 17.8571 11.6327 18.2041 11.6327 18.6224V19.5918C11.6327 20.0204 11.2857 20.3571 10.8673 20.3571H8.68367ZM19.1327 15.5C18.7041 15.5 18.3673 15.1531 18.3673 14.7347V13.7551C18.3673 13.3367 18.7143 12.9898 19.1327 12.9898H21.3163C21.7449 12.9898 22.0816 13.3367 22.0816 13.7551V14.7245C22.0816 15.1429 21.7347 15.4898 21.3163 15.4898H19.1327V15.5ZM14.0306 15.5C13.6122 15.5 13.2653 15.1531 13.2653 14.7347V13.7551C13.2653 13.3367 13.6122 12.9898 14.0306 12.9898H16.2143C16.6429 12.9898 16.9796 13.3367 16.9796 13.7551V14.7245C16.9796 15.1429 16.6327 15.4898 16.2143 15.4898H14.0306V15.5ZM8.68367 15.5C8.2551 15.5 7.91837 15.1531 7.91837 14.7347V13.7551C7.91837 13.3367 8.26531 12.9898 8.68367 12.9898H10.8673C11.2857 12.9898 11.6327 13.3367 11.6327 13.7551V14.7245C11.6327 15.1429 11.2857 15.4898 10.8673 15.4898H8.68367V15.5Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <AsideMenuListItem
        :selected="isPathSelected('directory')"
        class="my-[16px]"
        title="Настройки"
        @click="gotoDirectory"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M26.2489 10.823L24.2075 7.28692C24.0076 6.94021 23.6937 6.67359 23.3192 6.53257C22.9447 6.39154 22.5329 6.38484 22.154 6.51361L20.0486 7.2255C19.6857 6.98122 19.3066 6.76215 18.9137 6.56984L18.4786 4.39091C18.4002 3.99859 18.1882 3.64557 17.8788 3.39196C17.5693 3.13836 17.1816 2.99984 16.7815 3H12.6987C12.2986 2.99984 11.9108 3.13836 11.6014 3.39196C11.292 3.64557 11.08 3.99859 11.0016 4.39091L10.5665 6.56984C10.1692 6.76004 9.78567 6.97768 9.41864 7.22118L7.32535 6.51361C6.94669 6.38529 6.53525 6.39222 6.16113 6.53323C5.78701 6.67423 5.47335 6.94059 5.27358 7.28692L3.23219 10.823C3.03221 11.1693 2.95835 11.5741 3.02317 11.9687C3.08798 12.3632 3.28747 12.7232 3.5877 12.9872L5.25801 14.4551L5.25066 14.5612L5.25066 14.5613C5.23788 14.7435 5.22514 14.9252 5.22514 15.1099C5.22514 15.3331 5.23379 15.5537 5.24936 15.7725L3.58857 17.2326C3.28805 17.4965 3.08823 17.8563 3.0231 18.2509C2.95797 18.6455 3.03155 19.0504 3.23133 19.3969L5.27272 22.933C5.47241 23.2798 5.78631 23.5466 6.16082 23.6878C6.53533 23.829 6.94723 23.8358 7.32621 23.7071L9.43161 22.9944C9.79432 23.2391 10.1735 23.4585 10.5665 23.6509L11.0016 25.829C11.08 26.2213 11.292 26.5743 11.6014 26.8279C11.9108 27.0815 12.2986 27.22 12.6987 27.2199H16.4701V25.4899H12.6987L12.0846 22.4192C11.235 22.1036 10.4463 21.6435 9.75339 21.0594L6.77175 22.068L4.73036 18.5319L7.08748 16.4602C6.92621 15.5657 6.92416 14.6497 7.08142 13.7545L4.73036 11.688L6.77175 8.15191L9.73609 9.15531C10.434 8.57034 11.2288 8.11191 12.0846 7.80073L12.6987 4.72999H16.7815L17.3956 7.80073C18.2452 8.11637 19.0338 8.57639 19.7268 9.1605L22.7084 8.15191L24.7498 11.688L22.3296 13.809L23.4696 15.1099L25.8916 12.9872C26.1921 12.7234 26.3919 12.3636 26.4571 11.969C26.5222 11.5744 26.4486 11.1695 26.2489 10.823ZM14.7403 20.2999C13.7138 20.2999 12.7104 19.9955 11.8569 19.4252C11.0034 18.8549 10.3382 18.0444 9.94536 17.096C9.55254 16.1477 9.44976 15.1041 9.65002 14.0974C9.85028 13.0906 10.3446 12.1659 11.0704 11.44C11.7962 10.7142 12.721 10.2199 13.7278 10.0196C14.7345 9.81939 15.778 9.92217 16.7264 10.315C17.6747 10.7078 18.4853 11.373 19.0556 12.2265C19.6259 13.08 19.9302 14.0834 19.9302 15.1099C19.9377 15.7935 19.8085 16.4717 19.5503 17.1047C19.2921 17.7378 18.9101 18.3129 18.4266 18.7963C17.9432 19.2797 17.3681 19.6617 16.7351 19.9199C16.1021 20.1781 15.4239 20.3073 14.7403 20.2999ZM14.7403 11.6499C14.283 11.6395 13.8285 11.7219 13.404 11.8921C12.9795 12.0623 12.5939 12.3168 12.2705 12.6402C11.9471 12.9635 11.6927 13.3491 11.5225 13.7736C11.3523 14.1981 11.2699 14.6527 11.2803 15.1099C11.2699 15.5671 11.3523 16.0217 11.5225 16.4462C11.6927 16.8707 11.9471 17.2563 12.2705 17.5796C12.5939 17.903 12.9795 18.1575 13.404 18.3277C13.8285 18.4979 14.283 18.5803 14.7403 18.5699C15.1975 18.5803 15.6521 18.4979 16.0766 18.3277C16.501 18.1575 16.8866 17.903 17.21 17.5796C17.5334 17.2563 17.7879 16.8707 17.9581 16.4462C18.1283 16.0217 18.2107 15.5671 18.2003 15.1099C18.2107 14.6527 18.1283 14.1981 17.9581 13.7736C17.7879 13.3491 17.5334 12.9635 17.21 12.6402C16.8866 12.3168 16.501 12.0623 16.0766 11.8921C15.6521 11.7219 15.1975 11.6395 14.7403 11.6499ZM18.5546 21.6752L20.795 23.9156L25.6303 19.0802L26.8499 20.2999L20.795 26.3548L17.335 22.8949L18.5546 21.6752Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <AsideMenuListButton
        class="px-[12px] my-[16px]"
        title="Добавить задачу"
        @click="shouldShowInspector"
      />
      <EventAlert
        v-if="user?.tarif === 'trial' || user?.tarif === 'free'"
        :message-text="user?.tarif === 'trial' ? 'Пробная версия' : 'У Вас истекла лицензия, пожалуйста, обновите тариф'"
        :tarif="user?.tarif"
      />
    </div>
  </aside>
</template>
<script>
import { SWITCH_TAB } from '@/store/actions/tabs.js'
import * as TASK from '@/store/actions/tasks.js'

import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import InspectorLimit from '@/components/TasksList/InspectorLimit.vue'
import EventAlert from '@/components/EventAlert.vue'
import AsideMenuListItem from '@/components/AsideMenu/AsideMenuListItem.vue'
import AsideMenuListButton from '@/components/AsideMenu/AsideMenuListButton.vue'

export default {
  components: {
    InspectorLimit,
    EventAlert,
    InspectorModalBox,
    AsideMenuListItem,
    AsideMenuListButton
  },
  data: () => ({
    showFreeModal: false,
    showInspector: false
  }),
  computed: {
    lastTab () {
      return this.$store.state.navigator.lastTab
    },
    menu () {
      return this.$store.state.navigator.menu
    },
    user () {
      return this.$store.state.user.user
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    lastRoute () {
      return this.$router.currentRoute.value.path
    },
    lastRouteName () {
      return this.$router.currentRoute.value.name
    }
  },
  methods: {
    isPathSelected (code) {
      if (code === 'directory') {
        return ['colors', 'tags', 'employees', 'options', 'tarif', 'help'].includes(this.lastRouteName)
      }
      if (code === 'settings') {
        return ['account', 'karma'].includes(this.lastRouteName)
      }
      return this.lastRoute?.includes(code)
    },
    gotoProjects () {
      const elemToPush = {
        name: 'Проекты',
        uid: '7e345ae4-0408-416c-b1af-6bd8a15addec',
        type: 'greed',
        code: 'new_private_projects'
      }
      this.changeTab(elemToPush)
    },
    gotoBoards () {
      const elemToPush = {
        name: 'Доски',
        uid: '2e8dddd0-125a-49ef-a87c-0ea17b1b7f56',
        type: 'greed',
        code: 'new_private_boards'
      }
      this.changeTab(elemToPush)
    },
    gotoDirectory () {
      const elemToPush = {
        code: 'directory',
        name: 'Настройки',
        items: []
      }
      this.changeTab(elemToPush)
    },
    gotoTasks () {
      this.$store.dispatch(TASK.DAYS_WITH_TASKS)
      const elemToPush = {
        code: 'tasks',
        name: 'Задачи',
        items: []
      }
      this.changeTab(elemToPush)
    },
    gotoDoitnow () {
      const elemToPush = {
        code: 'doitnow',
        name: 'Очередь',
        items: [{}]
      }
      this.changeTab(elemToPush)
    },
    gotoSettings () {
      const elemToPush = {
        code: 'settings',
        name: 'Настройки',
        items: []
      }
      this.changeTab(elemToPush)
    },
    gotoReglaments () {
      const elemToPush = {
        code: 'reglaments',
        name: 'Регламенты',
        items: []
      }
      this.closeMenu()
      this.changeTab(elemToPush)
    },
    shouldShowInspector () {
      if (this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') {
        this.showFreeModal = true
        return
      }
      this.showInspector = true
    },
    changeTab (tab) {
      if (tab.code === 'doitnow') {
        this.$store.state.navigator.submenu.status = false
        if (this.$router.currentRoute.value.name !== 'doitnow') {
          this.$router.push('/doitnow')
        }
      } else if (tab.code !== 'reglaments') {
        this.$store.state.navigator.submenu.status = true
      }
      if (this.lastTab !== tab.code) {
        this.$store.dispatch(SWITCH_TAB, tab)
      }
    },
    closeMenu () {
      this.$store.state.navigator.submenu.status = false

      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
    }
  }
}
</script>
