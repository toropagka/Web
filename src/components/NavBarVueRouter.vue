<template>
  <div class="flex gap-[12px]">
    <template
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="breadcrumb.to"
    >
      <NavBarBreadcrumb
        :breadcrumb="{ ...breadcrumb, showNext: index !== breadcrumbs.length - 1 }"
      />
    </template>
  </div>
</template>

<script>
/**
 * Новый навбар для vue-router. Для автоматической генерации навбстака нужно в meta роута добавить объект вида:
 * {
 *   name: 'Название пути',
 *   to: '/route'
 * }
 */
import { mapMutations } from 'vuex'

import NavBarBreadcrumb from '@/components/Navbar/NavBarBreadcrumb.vue'

export default {
  components: {
    NavBarBreadcrumb
  },
  computed: {
    breadcrumbs () {
      return this.$store.state.navbarVueRouter.breadcrumbs
    }
  },
  mounted () {
    this.setBreadcrumbs(this.$route.matched.map(route => route.meta.breadcrumb || {}))
  },
  methods: {
    ...mapMutations('navbarVueRouter', {
      setBreadcrumbs: 'set'
    })
  }
}
</script>
