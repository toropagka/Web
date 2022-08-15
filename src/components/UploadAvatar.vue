<template>
  <Overlay>
    <div class="rounded-xl shadow-lg p-[24px] bg-white z-50 flex w-[900px]">
      <div class="grow max-h-[500px] w-[710px]">
        <cropper
          background-class="bg-transparent"
          :stencil-props="{
            aspectRatio: 1
          }"
          min-width="128"
          min-height="128"
          :src="img"
          @change="change"
        />
      </div>
      <div class="flex flex-col pl-3">
        <button
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto mb-[5px]"
          @click="uploadAvatar"
        >
          Обновить аватар
        </button>
        <button
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md border border-[#ff9123] bg-white text-[#ff9123] text-[13px] leading-[15px] font-medium font-roboto"
          @click="closeWindow"
        >
          Закрыть
        </button>
        <a
          ref="link"
          class="link"
          href="#"
        />
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from '@/components/modals/Overlay'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { USER_CHANGE_PHOTO } from '@/store/actions/user'

export default {
  components: { Overlay, Cropper },
  props: {
    img: {
      type: String,
      default: null
    }
  },
  emits: ['closeWindow'],
  data: function () {
    return {
      canvas: null
    }
  },
  methods: {
    uploadAvatar () {
      this.canvas.toBlob((blob) => {
        const formData = new FormData()
        formData.append('files[0]', blob)
        const data = {
          file: formData
        }
        this.$store.dispatch(USER_CHANGE_PHOTO, data)
        this.$emit('closeWindow')
      })
    },
    closeWindow () {
      this.$emit('closeWindow')
    },
    change ({ coordinates, canvas }) {
      console.log(coordinates, canvas)
      this.canvas = canvas
    }
  }
}
</script>
