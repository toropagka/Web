<template>
  <div
    ref="chat"
    class="pb-5"
  >
    <div
      v-for="message of messages"
      :key="message"
    >
      <InspectorMessage
        v-if="message.messageFromInspector"
        class="max-w-[334px]"
        :message="message.message"
        :type="message.type"
        :date="message.createDate"
        :select-employee="selectEmployee"
        :select-project="selectProject"
        :select-tag="selectTag"
        :select-color="selectColor"
        :select-access="selectAccess"
        :select-time="selectTime"
        :action-confirm-new-params="actionConfirmNewParams"
        :action-confirm-delegate="actionConfirmDelegate"
        :last-selected="lastSelected"
      />
      <CustomerMessage
        v-else
        :message="message.message"
        :type="message.type"
        :date="message.createDate"
      />
    </div>
  </div>
</template>
<script>
import InspectorMessage from '@/components/Inspector/InspectorMessage.vue'
import CustomerMessage from '@/components/Inspector/CustomerMessage.vue'

export default {
  components: {
    InspectorMessage,
    CustomerMessage
  },
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    selectEmployee: {
      type: Function,
      default: () => 1
    },
    selectProject: {
      type: Function,
      default: () => 1
    },
    selectTag: {
      type: Function,
      default: () => 1
    },
    selectColor: {
      type: Function,
      default: () => 1
    },
    selectAccess: {
      type: Function,
      default: () => 1
    },
    selectTime: {
      type: Function,
      default: () => 1
    },
    actionConfirmNewParams: {
      type: Function,
      default: () => 1
    },
    actionConfirmDelegate: {
      type: Function,
      default: () => 1
    },
    lastSelected: {
      type: Function,
      default: () => 1
    }
  },
  watch: {
    messages: {
      handler: function (oldVal, newVal) {
        this.$nextTick(() => {
          this.$refs.chat.scrollTo(0, this.$refs.chat.scrollHeight)
        })
      },
      deep: true
    }
  }
}
</script>
