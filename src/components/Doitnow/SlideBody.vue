<template>
  <InspectorModalBox
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @delegated="showSlide = false"
  />
  <div
    class="taskName p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden"
  >
    {{ title }}
  </div>
  <div
    class="description-content pl-5 mt-5 flex items-end"
  >
    <div
      class="font-[400] text-[14px] leading-[21px] text-[#4C4C4D] w-[50rem]"
      v-html="text"
    />
    <button
      v-if="name === 'addReglaments'"
      class="justify-center cursor-pointer bg-orange-400 text-white mt-2 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
      @click="clickAddReglament"
    >
      Создать регламент
    </button>
    <button
      v-if="name === 'delegateTasks'"
      class="justify-center cursor-pointer bg-orange-400 text-white mt-2 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
      @click="showInspector = true"
    >
      Поручить задачу
    </button>
  </div>
  <div
    v-if="video"
    class="font-[400] text-[14px] leading-[21px] pl-5 text-[#4C4C4D] mt-5"
  >
    <iframe
      width="560"
      height="315"
      :src="video"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="border rounded-xl"
    />
    <button
      v-if="name === 'addEmployees'"
      class="ml-5 justify-center cursor-pointer bg-orange-400 text-white mt-4 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
      @click="clickAddEmployees"
    >
      Добавить сотрудников
    </button>
  </div>
  <button
    v-if="name === 'welcome'"
    class="ml-5 justify-center cursor-pointer bg-orange-400 text-white mt-4 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
    @click="clickSuccess"
  >
    Понятно
  </button>
  <button
    v-if="name === 'addAvatar'"
    class="justify-center cursor-pointer bg-orange-400 text-white mt-2 text-lg p-2 rounded-md hover:bg-slate-200 hover:text-orange-400"
    @click="clickAddAvatar"
  >
    Загрузить
  </button>
</template>
<script>
import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import { NAVIGATOR_SUCCESS } from '@/store/actions/navigator'
import * as SLIDES from '@/store/actions/slides.js'
export default {
  components: {
    InspectorModalBox
  },
  props: {
    title: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: 'text'
    },
    video: {
      type: String,
      default: 'text'
    }
  },
  emits: ['nextTask'],
  data () {
    return {
      showInspector: false,
      showSlide: true
    }
  },
  computed: {
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    }
  },
  watch: {
    showSlide (newval, oldval) {
      if (!newval) {
        this.$emit('nextTask')
      }
    }
  },
  methods: {
    clickAddAvatar () {
      this.$emit('nextTask')
      this.$store.state.navigator.lastTab = 'settings'
      this.$router.push('/settings')
      this.$store.commit(NAVIGATOR_SUCCESS)
      this.$store.commit('updateStackWithInitValue', {
        name: 'Аккаунт',
        value: { uid: '9d3ba501-c173-462d-9b5f-0db97c06a026', param: new Date() },
        typeVal: new Date(),
        type: 'account'
      })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'settings' })
      this.$store.state.navigator.currentSettingsTab = 'account'
      localStorage.setItem('lastTab', 'settings')
    },
    clickSuccess () {
      this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'welcome', visible: false })
      this.$emit('nextTask')
    },
    clickAddEmployees () {
      this.$emit('nextTask')
      this.$store.state.navigator.lastTab = 'directory'
      this.$router.push('/directory')
      this.$store.commit(NAVIGATOR_SUCCESS)
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'new_emps' })
      const navElem = {
        name: 'Сотрудники',
        key: 'greedSource',
        greedPath: 'new_emps',
        value: this.storeNavigator.new_emps
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.new_emps })
      this.$store.state.navigator.currentSettingsTab = 'directory'
      localStorage.setItem('lastTab', 'directory')
    },
    clickAddReglament () {
      this.$emit('nextTask')
      this.$store.state.navigator.lastTab = 'directory'
      this.$router.push('/directory')
      this.$store.commit(NAVIGATOR_SUCCESS)
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglaments' })
      const navElem = {
        name: 'Сотрудники',
        key: 'greedSource',
        greedPath: 'reglaments',
        value: this.storeNavigator.reglaments
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.reglaments.items })
      this.$store.state.navigator.currentSettingsTab = 'directory'
      localStorage.setItem('lastTab', 'directory')
    }
  }
}
</script>
