<template>
  <VOnboardingWrapper
    ref="wrapper"
    :steps="steps"
  >
    <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
      <VOnboardingStep>
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="sm:flex sm:items-center sm:justify-between">
              <div v-if="step.content">
                <h3
                  v-if="step.content.title"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  {{ step.content.title }}
                </h3>
                <div
                  v-if="step.content.description"
                  class="mt-2 max-w-xl text-sm text-gray-500"
                >
                  <p>{{ step.content.description }}</p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                @click="exit"
              >
                exit
              </button>
              <div class="mt-5 space-x-4 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center relative">
                <span class="absolute right-0 bottom-full mb-2 mr-2 text-gray-600 font-medium text-xs">{{ `${index + 1}/${steps.length}` }}</span>
                <template v-if="!isFirst">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-100 px-4 py-2 font-medium text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:text-sm"
                    @click="previous"
                  >
                    Previous
                  </button>
                </template>
                <button
                  type="button"
                  class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                  @click="next"
                >
                  {{ isLast ? 'Finish' : 'Next' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </VOnboardingStep>
    </template>
  </VOnboardingWrapper>
  <div>
    <button id="foo">
      Welcome
    </button>
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
  setup () {
    const wrapper = ref(null)
    // eslint-disable-next-line no-unused-vars
    const { start, goToStep, finish } = useVOnboarding(wrapper)

    return {
      start,
      wrapper
    }
  },
  mounted () {
    this.start()
  }
}
</script>
