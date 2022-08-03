<template>
  <overlay>
    <card-component
      class="shadow-3xl border border-gray-300 max-h-modal md:w-3/5 lg:w-2/5 z-50 rounded-2xl"
    >
      <header>
        <div class="text-center text-3xl font-medium leading-8 pb-2">
          Загрузите Ваш аватар
        </div>
      </header>
      <main class="flex flex-col justify-center items-center">
        <div class="mt-4 text-center ">
          <label
            for="iconfile"
            class="justify-center cursor-pointer bg-orange-400 text-white mt-2 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
          >
            Загрузить
          </label>
          <input
            id="iconfile"
            type="file"
            class="hidden"
            accept="image/png, image/jpeg"
            @change="changeUserPhoto"
          >
        </div>
        <p
          v-if="checkAvatar"
          class="mt-2 text-2xl text-red-600"
        >
          Вы не загрузили аватар
        </p>
        <img
          v-if="avatar"
          :src="$store.state.user.user?.foto_link"
          class="rounded-[27px] content-center object-cover w-[150px] h-[150px] mt-4"
        >
      </main>
      <footer class="w-[100%] flex flex-col">
        <div class="flex justify-end">
          <button
            class="bg-orange-400 text-white mt-2 text-xl p-2 rounded-md"
            @click="confirmAvatar"
          >
            Подтвердить
          </button>
        </div>
      </footer>
    </card-component>
  </overlay>
</template>
<script>
import Overlay from '@/components/modals/Overlay.vue'
import CardComponent from '@/components/CardComponent.vue'
import { USER_CHANGE_PHOTO } from '@/store/actions/user.js'

export default {
  components: {
    Overlay,
    CardComponent
  },
  emits: ['confirm'],
  data () {
    return {
      avatar: false,
      checkAvatar: false
    }
  },
  methods: {
    changeUserPhoto (event) {
      const files = event.target.files
      const formData = new FormData()
      const file = files[0]
      formData.append('files[0]', file)
      const data = {
        file: formData
      }
      this.$store.dispatch(USER_CHANGE_PHOTO, data).then(() => {
        this.avatar = true
        this.checkAvatar = false
      })
    },
    confirmAvatar () {
      if (this.avatar) {
        this.$emit('confirm', true)
      } else {
        this.checkAvatar = true
      }
    }
  }
}
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
