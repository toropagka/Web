<template>
  <Overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <CardComponent
      v-show="value"
      has-table
      :title="title"
      class="shadow-3xl border border-gray-300 max-h-modal md:w-4/5 lg:w-2/5 z-50 p-5 rounded-2xl"
      @header-icon-click="cancel"
    >
      <div class="space-y-3 items-center justify-center">
        <slot />
      </div>

      <div
        class="flex items-stretch justify-between mt-5"
      >
        <JbButton
          v-if="hasCancel"
          class="w-full mr-5"
          label="Отмена"
          :color="button"
          outline
          @click="cancel"
        />
        <JbButton
          v-if="hasButton"
          :label="buttonLabel"
          :color="button"
          class="w-full"
          @click="confirm"
        />
      </div>
    </CardComponent>
  </Overlay>
</template>

<script>
import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'

export default {
  components: {
    JbButton,
    CardComponent,
    Overlay
  },
  props: {
    title: {
      type: String,
      default: null
    },
    button: {
      type: String,
      default: 'white'
    },
    buttonLabel: {
      type: String,
      default: 'Done'
    },
    hasCancel: Boolean,
    modelValue: {
      type: [String, Number, Boolean],
      default: null
    },
    hasButton: Boolean
  },
  emits: ['update:modelValue', 'cancel', 'confirm'],
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        return this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    confirmCancel (mode) {
      this.value = false
      this.$emit(mode)
    },
    confirm () {
      this.confirmCancel('confirm')
    },
    cancel () {
      this.confirmCancel('cancel')
    }
  }
}
</script>
