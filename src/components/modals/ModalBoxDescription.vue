<script setup>
import { computed } from 'vue'
import JbButton from '@/components/JbButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'

const props = defineProps({
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
})

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const confirmCancel = mode => {
  value.value = false
  emit(mode)
}

const confirm = () => confirmCancel('confirm')
const cancel = () => confirmCancel('cancel')

</script>

<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <card-component
      v-show="value"
      has-table
      :title="title"
      class="shadow-3xl border border-gray-300 max-h-modal md:w-4/5 lg:w-2/5 z-50 p-5 rounded-2xl"
      @header-icon-click="cancel"
    >
      <div class="space-y-3 justify-end">
        <slot />
      </div>

      <div
        class="flex justify-center mt-3 mr-4"
      >
        <jb-button
          v-if="hasButton"
          :label="buttonLabel"
          :color="button"
          class="w-[30%]"
          @click="confirm"
        />
      </div>
    </card-component>
  </overlay>
</template>
