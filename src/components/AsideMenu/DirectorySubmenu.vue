<template>
  <div class="px-[16px] pt-[15px]">
    <AsideMenuListSkeleton v-if="status == 'loading'" />
    <div v-if="status == 'success'">
      <AsideMenuListItem
        :selected="isReglamentsSelected"
        title="Регламенты"
        @click="gotoReglaments"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59.346 18.2667L45.746 4.66667C45.346 4.26667 44.746 4 44.146 4C43.546 4 42.946 4.26667 42.546 4.66667L35.546 11.6667C34.6793 12.5333 34.6793 14 35.546 14.8667L35.6126 14.9333L18.0793 23.6667C17.6126 23.9333 17.2126 24.3333 17.0126 24.8667L4.21263 56.8667C4.21263 56.9333 4.14597 57 4.14597 57.0667C4.0793 57.2 4.01263 57.3333 4.01263 57.4667C3.94597 58.0667 4.14597 58.6667 4.54597 59.1333C4.94597 59.7333 5.61263 60 6.2793 60C6.41263 60 6.54597 60 6.6793 59.9333C6.74597 59.9333 6.81263 59.9333 6.8793 59.8667C6.94597 59.8667 7.01263 59.8 7.0793 59.8L39.0793 47C39.6126 46.8 40.0126 46.4 40.2793 45.9333L49.0126 28.4L49.0793 28.4667C49.4793 28.8667 50.0793 29.1333 50.6793 29.1333C51.2793 29.1333 51.8793 28.8667 52.2793 28.4667L59.346 21.4667C60.2126 20.6 60.2126 19.1333 59.346 18.2667ZM27.746 35.3333C27.746 34.8 28.146 34.4 28.6793 34.4C29.2126 34.4 29.6126 34.8 29.6126 35.3333C29.6126 35.8667 29.2126 36.2667 28.6793 36.2667C28.146 36.2667 27.746 35.8 27.746 35.3333ZM15.6793 51.5333L26.746 40.4667C27.346 40.6667 28.0126 40.8 28.6793 40.8C31.6793 40.8 34.146 38.3333 34.146 35.3333C34.146 32.3333 31.6793 29.8667 28.6793 29.8667C25.6793 29.8667 23.2126 32.3333 23.2126 35.3333C23.2126 36 23.346 36.6667 23.546 37.2667L12.4793 48.3333L20.8793 27.3333L38.946 18.2667L45.6793 25L36.6793 43.1333L15.6793 51.5333ZM40.346 13.2667L44.146 9.46667L54.546 19.8667L50.746 23.6667L40.346 13.2667Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
      <AsideMenuListItem
        :selected="isEmpsSelected"
        title="Сотрудники"
        @click="gotoEmps"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.9998 6.54762C14.5894 6.54762 14.1957 6.71067 13.9055 7.00091C13.6153 7.29114 13.4522 7.68478 13.4522 8.09524C13.4522 8.50569 13.6153 8.89933 13.9055 9.18957C14.1957 9.4798 14.5894 9.64286 14.9998 9.64286C15.4103 9.64286 15.8039 9.4798 16.0942 9.18957C16.3844 8.89933 16.5475 8.50569 16.5475 8.09524C16.5475 7.68478 16.3844 7.29114 16.0942 7.00091C15.8039 6.71067 15.4103 6.54762 14.9998 6.54762ZM11.9046 8.09524C11.9046 7.27433 12.2307 6.48704 12.8112 5.90657C13.3916 5.3261 14.1789 5 14.9998 5C15.8207 5 16.608 5.3261 17.1885 5.90657C17.769 6.48704 18.0951 7.27433 18.0951 8.09524C18.0951 8.91615 17.769 9.70343 17.1885 10.2839C16.608 10.8644 15.8207 11.1905 14.9998 11.1905C14.1789 11.1905 13.3916 10.8644 12.8112 10.2839C12.2307 9.70343 11.9046 8.91615 11.9046 8.09524ZM22.351 7.32143C22.0432 7.32143 21.748 7.44372 21.5303 7.66139C21.3126 7.87907 21.1903 8.1743 21.1903 8.48214C21.1903 8.78998 21.3126 9.08522 21.5303 9.30289C21.748 9.52057 22.0432 9.64286 22.351 9.64286C22.6589 9.64286 22.9541 9.52057 23.1718 9.30289C23.3895 9.08522 23.5117 8.78998 23.5117 8.48214C23.5117 8.1743 23.3895 7.87907 23.1718 7.66139C22.9541 7.44372 22.6589 7.32143 22.351 7.32143ZM19.6427 8.48214C19.6427 8.12648 19.7127 7.7743 19.8489 7.44571C19.985 7.11712 20.1845 6.81855 20.4359 6.56706C20.6874 6.31557 20.986 6.11608 21.3146 5.97997C21.6432 5.84386 21.9954 5.77381 22.351 5.77381C22.7067 5.77381 23.0589 5.84386 23.3875 5.97997C23.7161 6.11608 24.0146 6.31557 24.2661 6.56706C24.5176 6.81855 24.7171 7.11712 24.8532 7.44571C24.9893 7.7743 25.0594 8.12648 25.0594 8.48214C25.0594 9.20044 24.774 9.88931 24.2661 10.3972C23.7582 10.9051 23.0693 11.1905 22.351 11.1905C21.6327 11.1905 20.9439 10.9051 20.4359 10.3972C19.928 9.88931 19.6427 9.20044 19.6427 8.48214ZM6.48793 8.48214C6.48793 8.1743 6.61022 7.87907 6.8279 7.66139C7.04557 7.44372 7.34081 7.32143 7.64865 7.32143C7.95649 7.32143 8.25172 7.44372 8.4694 7.66139C8.68707 7.87907 8.80936 8.1743 8.80936 8.48214C8.80936 8.78998 8.68707 9.08522 8.4694 9.30289C8.25172 9.52057 7.95649 9.64286 7.64865 9.64286C7.34081 9.64286 7.04557 9.52057 6.8279 9.30289C6.61022 9.08522 6.48793 8.78998 6.48793 8.48214ZM7.64865 5.77381C6.93035 5.77381 6.24148 6.05915 5.73357 6.56706C5.22566 7.07497 4.94031 7.76385 4.94031 8.48214C4.94031 9.20044 5.22566 9.88931 5.73357 10.3972C6.24148 10.9051 6.93035 11.1905 7.64865 11.1905C8.36694 11.1905 9.05582 10.9051 9.56373 10.3972C10.0716 9.88931 10.357 9.20044 10.357 8.48214C10.357 7.76385 10.0716 7.07497 9.56373 6.56706C9.05582 6.05915 8.36694 5.77381 7.64865 5.77381ZM9.31311 21.6408C8.96314 21.8714 8.55724 22.0031 8.1385 22.0217C7.71975 22.0402 7.30379 21.9451 6.93475 21.7463C6.56572 21.5476 6.25738 21.2526 6.04247 20.8927C5.82756 20.5329 5.7141 20.1215 5.71412 19.7024V14.6726C5.71412 14.57 5.75489 14.4716 5.82745 14.399C5.9 14.3265 5.99841 14.2857 6.10103 14.2857H9.22025C9.29083 13.7191 9.51748 13.1833 9.8749 12.7381H6.10103C5.58796 12.7381 5.09591 12.9419 4.73311 13.3047C4.37032 13.6675 4.1665 14.1596 4.1665 14.6726V19.7024C4.1663 20.3687 4.33818 21.0237 4.66549 21.6041C4.99279 22.1845 5.46443 22.6705 6.03472 23.0151C6.60501 23.3596 7.25461 23.5511 7.92062 23.5709C8.58663 23.5907 9.24646 23.4381 9.83621 23.128C9.59452 22.6586 9.41851 22.1582 9.31311 21.6408ZM20.1635 23.128C20.7532 23.4381 21.413 23.5907 22.0791 23.5709C22.7451 23.5511 23.3947 23.3596 23.965 23.0151C24.5352 22.6705 25.0069 22.1845 25.3342 21.6041C25.6615 21.0237 25.8334 20.3687 25.8332 19.7024V14.6726C25.8332 14.1596 25.6294 13.6675 25.2666 13.3047C24.9038 12.9419 24.4117 12.7381 23.8986 12.7381H20.1248C20.4819 13.1835 20.7085 13.7192 20.7794 14.2857H23.8986C24.0013 14.2857 24.0997 14.3265 24.1722 14.399C24.2448 14.4716 24.2856 14.57 24.2856 14.6726V19.7024C24.2856 20.1215 24.1721 20.5329 23.9572 20.8927C23.7423 21.2526 23.434 21.5476 23.0649 21.7463C22.6959 21.9451 22.2799 22.0402 21.8612 22.0217C21.4424 22.0031 21.0365 21.8714 20.6866 21.6408C20.5812 22.1581 20.4051 22.6586 20.1635 23.128ZM12.2915 12.7381C11.7784 12.7381 11.2864 12.9419 10.9236 13.3047C10.5608 13.6675 10.357 14.1596 10.357 14.6726V20.4762C10.357 21.7076 10.8461 22.8885 11.7168 23.7592C12.5875 24.6299 13.7685 25.119 14.9998 25.119C16.2312 25.119 17.4121 24.6299 18.2828 23.7592C19.1535 22.8885 19.6427 21.7076 19.6427 20.4762V14.6726C19.6427 14.1596 19.4389 13.6675 19.0761 13.3047C18.7133 12.9419 18.2212 12.7381 17.7082 12.7381H12.2915ZM11.9046 14.6726C11.9046 14.57 11.9454 14.4716 12.0179 14.399C12.0905 14.3265 12.1889 14.2857 12.2915 14.2857H17.7082C17.8108 14.2857 17.9092 14.3265 17.9818 14.399C18.0543 14.4716 18.0951 14.57 18.0951 14.6726V20.4762C18.0951 21.2971 17.769 22.0844 17.1885 22.6649C16.608 23.2453 15.8207 23.5714 14.9998 23.5714C14.1789 23.5714 13.3916 23.2453 12.8112 22.6649C12.2307 22.0844 11.9046 21.2971 11.9046 20.4762V14.6726Z"
            fill="currentColor"
          />
        </svg>
      </AsideMenuListItem>
    </div>
  </div>
  <div v-if="status == 'success'">
    <template
      v-for="(menuGroup, index) in menu"
      :key="`b-${index}`"
    >
      <aside-menu-list
        :menu="menuGroup"
        @menu-click="menuClick"
      />
    </template>
  </div>
</template>

<script>
import AsideMenuList from '@/components/AsideMenu/AsideMenuList.vue'
import AsideMenuListSkeleton from '@/components/AsideMenu/AsideMenuListSkeleton.vue'
import AsideMenuListItem from '@/components/AsideMenu/AsideMenuListItem.vue'

export default {
  components: {
    AsideMenuListSkeleton,
    AsideMenuList,
    AsideMenuListItem
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    isReglamentsSelected () {
      return this.lastNavStack?.greedPath === 'reglaments' ||
        this.lastNavStack?.global_property_uid === '92413f6c-2ef3-476e-9429-e76d7818685d'
    },
    isEmpsSelected () {
      return this.lastNavStack?.greedPath === 'new_emps'
    }
  },
  methods: {
    selectSubMenuItem (isSelected, cbOpenView) {
      localStorage.setItem('lastTab', 'directory')
      // закрываем сабменю
      this.$store.state.navigator.submenu.status = false
      // если вкладка не поменялась - ничего не делаем
      if (isSelected) return
      // закрываем свойства
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
      cbOpenView()
    },
    gotoEmps () {
      this.selectSubMenuItem(this.isEmpsSelected, () => {
        // открываем вид
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'new_emps' })
        const navElem = {
          name: 'Сотрудники',
          key: 'greedSource',
          greedPath: 'new_emps',
          value: this.storeNavigator.new_emps
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: navElem.value })
      })
    },
    gotoReglaments () {
      this.selectSubMenuItem(this.isReglamentsSelected, () => {
        // открываем вид
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: 'reglaments' })
        const navElem = {
          name: 'Регламенты',
          key: 'greedSource',
          greedPath: 'reglaments',
          value: this.storeNavigator.reglaments?.items
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: navElem.value })
      })
    },
    // TODO: clean up messy logic
    menuClick (event, item) {
      localStorage.setItem('lastTab', 'directory')
      this.$store.state.navigator.submenu.status = false

      console.log('directory', item)

      // Если уже находимся на этой вкладке игнорировать дальнейший код
      if (this.checkOnWhichTab(item)) {
        return
      }

      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }

      // colors & tags
      if (item.uid === 'ed8039ae-f3de-4369-8f32-829d401056e9' || item.uid === '00a5b3de-9474-404d-b3ba-83f488ac6d30') {
        this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
        this.$store.commit('basic', { key: 'greedPath', value: item.path })
        const navElem = {
          name: item.label,
          key: 'greedSource',
          greedPath: item.path,
          value: this.storeNavigator[item.path]?.items
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path]?.items })
        return
      }

      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: item.path })
      if (item.path === 'new_private_projects' || item.path === 'new_emps' || item.path === 'new_delegate' || item.path === 'new_private_boards') {
        const navElem = {
          name: item.label,
          key: 'greedSource',
          greedPath: item.path,
          value: this.storeNavigator[item.path]
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path] })
      } else {
        console.log(item.uid)
        const navElem = {
          name: item.label,
          key: 'greedSource',
          greedPath: item.path,
          value: this.storeNavigator[item.path]?.items
        }
        this.$store.commit('updateStackWithInitValue', navElem)
        this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator[item.path]?.items })
      }
    },
    checkOnWhichTab (item) {
      if (this.lastNavStack?.value?.uid === item.uid ||
        this.lastNavStack?.uid === item.uid ||
        this.lastNavStack?.name === item.label ||
        (this.lastNavStack.name && item.name && this.lastNavStack?.name === item.name)) {
        return true
      }
    }
  }
}
</script>
