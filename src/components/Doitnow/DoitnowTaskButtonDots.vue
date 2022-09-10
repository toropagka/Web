<template>
  <PopMenu
    placement="bottom"
  >
    <div
      style="color: gray"
    >
      <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        width="20"
        height="20"
        class="inline-block"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="currentColor"
        d="M10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14Z"
      /><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="currentColor"
        d="M10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8Z"
      /><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="currentColor"
        d="M10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2Z"
      /></svg>
    </div>
    <template #menu>
      <PopMenuHeader
        title="Дата создания:"
      >
        {{ dateCreateText }}
      </PopMenuHeader>
      <PopMenuItem
        @click="selectItem('toggleFiles')"
      >
        {{ onlyFiles ? 'Показать весь чат' : 'Показать только файлы' }}
      </PopMenuItem>
      <PopMenuItem
        @click="selectItem('copyUrl')"
      >
        Копировать как ссылку
      </PopMenuItem>
      <PopMenuItem
        v-if="showDelete"
        @click="selectItem('deleteTask')"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuHeader from '@/components/Common/PopMenuHeader.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuHeader
  },
  props: {
    dateCreate: {
      type: String,
      default: ''
    },
    onlyFiles: {
      type: Boolean,
      default: false
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['copyUrl', 'deleteTask', 'toggleFiles'],
  computed: {
    dateCreateText () {
      const date = new Date(this.dateCreate)
      return date.toLocaleString('default', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  },
  methods: {
    selectItem (value) {
      this.$emit(value)
    }
  }
}
</script>

<style scoped>
.tags-custom {
  border-radius: 5px;
  background: #f4f5f7;
  padding: 4px 0px 4px 0px;
  margin: 2px 2px 2px 2px;
  position: relative;
  float: none;
  display: flex;
  cursor: pointer;
}
.tags-custom svg {
  position: relative;
  float: left;
  display: flex;
  margin-right: 5px;
  left: 3px;
  top: 0;
  color: #A6A6A6;
}
</style>
