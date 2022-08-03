<template>
  <div
    class="w-full h-full absolute bg-transparent top-0 left-0 z-40"
  >
    <VOnboardingWrapper
      ref="wrapper"
      class="z-60"
      :steps="steps"
    >
      <template #default="{ previous, next, step, isFirst, isLast, index }">
        <VOnboardingStep
          :title="options"
        >
          <div class="bg-white shadow rounded mt-[10px] max-w-[400px] ml-3">
            <div class="px-4 py-5 sm:p-6 flex">
              <div class="sm:flex sm:items-center sm:justify-between flex-col">
                <div v-if="step.content">
                  <div class="flex justify-between">
                    <h3
                      v-if="step.content.title"
                      class="text-lg font-medium leading-6 text-gray-900"
                    >
                      {{ step.content.title }}
                    </h3>
                    <span class="right-0 bottom-full mt-[-10px] mr-[-5px] text-gray-600 font-medium text-xs">{{ `${index + 1}/${steps.length}` }}</span>
                  </div>
                  <div
                    v-if="step.content.description"
                    class="mt-2 max-w-xl text-sm text-gray-500"
                  >
                    <p>{{ step.content.description }}</p>
                  </div>
                </div>
                <div class="mt-5 space-x-2 flex justify-end w-full">
                  <template v-if="!isFirst">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-md border border-transparent bg-[#e3e3e3] px-4 py-2 font-medium text-black hover:bg-[#c9c9c7] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
                      @click="previous"
                    >
                      Назад
                    </button>
                  </template>
                  <button
                    v-if="!isLast"
                    type="button"
                    class="inline-flex items-center rounded-md border border-transparent bg-[#FF912380] px-4 py-2 font-medium text-black shadow-sm hover:bg-[#F5DEB3] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    @click="next"
                  >
                    Далее
                  </button>
                  <button
                    v-if="isLast"
                    type="button"
                    class="inline-flex items-center rounded-md border border-transparent bg-[#DCDCDC] px-4 py-2 font-medium text-black shadow-sm hover:bg-[#8a8a8a] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    @click="$emit('shouldShowOnboarding', false)"
                  >
                    Выход
                  </button>
                </div>
              </div>
            </div>
          </div>
        </VOnboardingStep>
      </template>
    </VOnboardingWrapper>
  </div>
</template>
<script>
import { ref } from 'vue'
import { VOnboardingWrapper, useVOnboarding, VOnboardingStep } from 'v-onboarding'
export default {
  components: {
    VOnboardingWrapper,
    VOnboardingStep
  },
  props: {
    steps: {
      type: Array,
      default: () => []
    }
  },
  emits: ['shouldShowOnboarding'],
  setup () {
    const wrapper = ref(null)
    // eslint-disable-next-line no-unused-vars
    const { start, goToStep, finish } = useVOnboarding(wrapper)

    return {
      start,
      wrapper
    }
  },
  data () {
    return {
      // кастомные настройки для онборда, документация: https://github.com/fatihsolhan/v-onboarding/blob/fa00ae45017eb0fc30550965278da9062277a7f1/docs/pages/3.props/2.options.md
      options: {
        popper: {},
        overlay: {
          enabled: true,
          padding: 0,
          borderRadius: 20
        },
        scrollToStep: {
          enabled: true,
          options: {
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          }
        }
      }
    }
  },
  mounted () {
    this.start()
  }
}
</script>
