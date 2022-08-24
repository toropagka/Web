<template>
  <component
    :is="is"
    :class="componentClass"
    :to="to"
    :href="href"
    :exact-active-class="activeClass"
  >
    <slot />
  </component>
</template>

<script>

export default {
  props: {
    href: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'flex'
    },
    activeColor: {
      type: String,
      default: 'text-blue-600'
    },
    isFirstOrLastItem: {
      type: Boolean,
      default: false
    },
    hasDivider: Boolean,
    isDesktopIconOnly: Boolean,
    dropdown: Boolean,
    active: Boolean
  },
  computed: {
    is () {
      if (this.href) {
        return 'a'
      }

      if (this.to) {
        return 'router-link'
      }

      return 'div'
    },
    componentClass () {
      const base = [
        this.type,
        'items-center',
        'grow-0',
        'shrink-0',
        'relative',
        'font-light',
        'text-gray-700',
        'hover:text-blue-500',
        this.active ? this.activeColor : 'text-black dark:text-white dark:hover:text-gray-400'
      ]

      if (this.type === 'block') {
        base.push('lg:flex')
      }

      if (!this.isFirstOrLastItem) {
        base.push('cursor-pointer')
      }

      if (!this.dropdown) {
        base.push('py-2', 'px-3')
      } else {
        base.push('p-0', 'lg:py-2', 'lg:px-3')
      }

      if (this.hasDivider) {
        base.push('lg:border-r', 'lg:border-gray-100', 'lg:dark:border-gray-800')
      }

      if (this.isDesktopIconOnly) {
        base.push('lg:w-16', 'lg:justify-center')
      }

      return base
    },
    activeClass () {
      return this.is === 'router-link' ? this.activeColor : null
    }
  }
}

</script>
