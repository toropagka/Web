
<template>
  <div class="relative">
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
    >
      <option
        v-for="option in options"
        :key="option.id ?? option"
        :value="option"
      >
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :placeholder="placeholder"
      :required="required"
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
      :disabled="disabled"
      @blur="blur"
    >
    <ControlIcon
      v-if="icon"
      :icon="icon"
      :class="iconClass"
      :h="controlIconH"
      @click="iconClick"
    />
  </div>
</template>

<script>
import ControlIcon from '@/components/ControlIcon.vue'

export default {
  components: {
    ControlIcon
  },
  props: {
    name: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    },
    autocomplete: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    maxlength: {
      type: String,
      default: null
    },
    iconClass: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    options: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    },
    required: Boolean,
    disabled: Boolean,
    borderless: Boolean,
    transparent: Boolean,
    ctrlKFocus: Boolean,
    valid: Boolean
  },
  emits: ['update:modelValue', 'iconClick', 'blur'],
  computed: {
    computedValue: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    },
    inputElClass () {
      const base = [
        'px-3 pl-10 py-2 max-w-full text-sm border-gray-300 disabled:border-stone-500 disabled:bg-amber-50 disabled:ring-0 focus:ring-0 rounded-lg w-full',
        // 'focus:border-stone-500 focus:bg-amber-50',
        'focus:border-gray-300',
        'dark:placeholder-gray-400',
        this.computedType.value === 'textarea' ? 'h-24' : 'h-12',
        this.borderless ? 'border-0' : 'border-2',
        this.transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-800',
        this.valid ? 'border-stone-500 bg-amber-50' : ''
      ]

      if (this.icon) {
        base.push('pl-10')
      }

      return base
    },
    computedType () {
      return this.options ? 'select' : this.type
    },
    controlIconH () {
      return this.type === 'textarea' ? 'h-full' : 'h-12'
    }
  },
  mounted () {
    if (this.show) {
      this.$nextTick(() => {
        return this.$refs.inputEl.focus()
      })
    }
    if (!this.$store.state.isFieldFocusRegistered) {
      window.addEventListener('keydown', this.fieldFocusHook)

      this.$store.commit('basic', {
        key: 'isFieldFocusRegistered',
        value: true
      })
    }
  },
  unmounted () {
    window.removeEventListener('keydown', this.fieldFocusHook)

    this.$store.commit('basic', {
      key: 'isFieldFocusRegistered',
      value: false
    })
  },
  methods: {
    fieldFocusHook (e) {
      if (this.ctrlKFocus) {
        if (e.ctrlKey && e.key === 'k') {
          e.preventDefault()
          this.$refs.inputEl.focus()
        } else if (e.key === 'Escape') {
          this.$refs.inputEl.blur()
        }
      }
    },
    blur (e) {
      this.$emit('blur', e)
    },
    iconClick  (e) {
      this.$emit('iconClick', e)
    }
  }
}
</script>
