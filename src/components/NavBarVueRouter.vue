<template>
  <div class="flex">
    <template
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="breadcrumb.to"
    >
      <router-link
        v-if="breadcrumb.to"
        class="font-['Roboto'] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[16px] breadcrumbs text-[#4C4C4D] font-[700]"
        :to="breadcrumb.to"
      >
        {{ breadcrumb.name }}
      </router-link>
      <span
        v-else
        class="font-['Roboto'] dark:bg-gray-700 dark:text-gray-100 rounded-lg text-[16px] breadcrumbs text-[#4C4C4D] font-[700]"
      >
        {{ breadcrumb.name }}
      </span>
      <Icon
        v-if="index !== breadcrumbs.length - 1"
        class="ml-2.5 mr-2.5 text-gray-500"
        :path="arrowForward.path"
        :width="6"
        :height="12"
        :box="arrowForward.viewBox"
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

import Icon from '@/components/Icon.vue'
import arrowForward from '@/icons/arrow-forward.js'

export default {
  components: {
    Icon
  },
  computed: {
    breadcrumbs () {
      return this.$store.state.navbarVueRouter.breadcrumbs
    },
    arrowForward () {
      return arrowForward
    }
  },
  mounted () {
    this.setBreadcrumbs(this.$route.matched.map(route => route.meta.breadcrumb))
  },
  methods: {
    ...mapMutations('navbarVueRouter', {
      setBreadcrumbs: 'set'
    })
  }
}
</script>
