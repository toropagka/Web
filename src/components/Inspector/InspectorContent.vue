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
      type: Array
    },
    selectEmployee: {
      type: Function
    },
    selectProject: {
      type: Function
    },
    selectTag: {
      type: Function
    },
    selectColor: {
      type: Function
    },
    selectAccess: {
      type: Function
    },
    selectTime: {
      type: Function
    },
    actionConfirmNewParams: {
      type: Function
    },
    actionConfirmDelegate: {
      type: Function
    },
    lastSelected: {
      type: Function
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
