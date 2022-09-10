<template>
  <ModalBox
    :title="'Невозможно загрузить ' + fileLabel"
    @cancel="onCancel"
  >
    <div class="flex flex-col">
      <div class="text-[#7e7e80] text-[13px] leading-[18px] font-roboto whitespace-pre-line">
        <div
          v-for="file in files"
          :key="file"
        >
          {{ file.name }} : {{ roundFloat(file.size / 1024 / 1024) }}Mb
        </div>
        <br>
        Максимальный размер файла 50Mb
      </div>
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    files: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['cancel'],
  computed: {
    fileLabel () { return this.files.length > 1 ? 'файлы' : 'файл' }
  },
  methods: {
    roundFloat (value) {
      return Math.round(value)
    },
    onCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
