<template>
  <component
    :is="is"
    :class="componentClass"
    :href="href"
    :type="computedType"
    :to="to"
    :target="target"
    :disabled="disabled"
  >
    <span
      v-if="label"
      :class="labelClass"
    >{{ label }}</span>
    <Icon
      v-if="icon"
      :path="icon"
      :box="'0 0 24 24'"
    />
  </component>
</template>

<script>
import { getButtonColor } from '@/colors.js'
import Icon from '@/components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    label: {
      type: [String, Number],
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    href: {
      type: String,
      default: null
    },
    rounded: {
      type: String,
      default: 'rounded'
    },
    target: {
      type: String,
      default: null
    },
    to: {
      type: [String, Object],
      default: null
    },
    type: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'white'
    },
    as: {
      type: String,
      default: null
    },
    small: Boolean,
    outline: Boolean,
    active: Boolean,
    disabled: Boolean
  },
  computed: {
    is () {
      if (this.as) {
        return this.as
      }

      if (this.to) {
        return 'router-link'
      }

      if (this.href) {
        return 'a'
      }

      return 'button'
    },
    computedType () {
      if (this.is === 'button') {
        return this.type ?? 'button'
      }

      return null
    },
    labelClass () {
      return this.small && this.icon ? 'px-0.5' : 'px-1'
    },
    componentClass () {
      const base = [
        'inline-flex',
        'cursor-pointer',
        'justify-center',
        'items-center',
        'whitespace-nowrap',
        'focus:outline-none',
        'transition-colors',
        'focus:ring',
        'duration-150',
        'py-2.5',
        'border',
        'rounded-lg',
        this.active ? 'ring ring-black dark:ring-white' : 'ring-blue-700',
        this.small ? 'p-1' : 'p-2',
        getButtonColor(this.color, this.outline, !this.disabled)
      ]

      if (this.disabled) {
        base.push(
          'cursor-not-allowed',
          this.outline ? 'opacity-50' : 'opacity-70'
        )
      }

      return base
    }
  }
}
</script>

<style scoped></style>
