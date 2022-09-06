<template>
  <InspectorModalBox
    v-model="showInspector"
    button="warning"
    has-button
    has-cancel
    button-label="Delete"
    @delegated="showSlide = false"
  />
  <div class="flex items-center justify-center text-center flex-col">
    <!-- welcome -->
    <div
      v-if="name === 'welcome'"
      class="flex flex-col items-center w-8/12"
    >
      <div
        class="taskName leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
      >
        Добро пожаловать в ЛидерТаск Web!
      </div>
      <div class="flex justify-center">
        <article class="font-[400] text-[18px] text-left leading-[29px] w-full text-[#4C4C4D] mb-[35px] pl-0">
          <p class="mb-3">
            ЛидерТаск – это система для совместной работы в команде, которая:
          </p>
          <ul class="list-decimal pl-10">
            <li>запишет и сохранит все задачи, проекты, дела и встречи;</li>
            <li>проследит за выполнением ваших поручений сотрудникам;</li>
            <li>будет вести статистику каждого участника команды;</li>
            <li>автоматизирует внедрение новых сотрудников;</li>
            <li>и многое другое.</li>
          </ul>
        </article>
      </div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/FbdQZihaWqQ"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="border rounded-xl"
      />
      <button
        class="w-[238px] mt-[35px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
        @click="clickSuccess"
      >
        Понятно
      </button>
    </div>

    <!-- addAvatar -->
    <div
      v-if="name === 'addAvatar'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
        >
          Установите фото профиля (аватар) в ЛидерТаск
        </div>
        <div>
          <article class="font-[400] text-[18px] leading-[29px] text-left w-full text-[#4C4C4D] mb-[35px] pl-0">
            <p>
              1. Аватар поможет вашим коллегам быстрее найти Вас в списках <br>
              (особенно, когда в вашей команде есть сотрудники с одинаковыми именами);
            </p>
            <p>2. это просто, эстетично и гораздо лучше стандартной серой картинки.</p>
          </article>
        </div>
      </div>
      <button
        class="w-[238px] h-[40px] text-[14px] justify-center cursor-pointer bg-[#F2B679] text-[#2E2E2E] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
        @click="clickAddAvatar"
      >
        Загрузить
      </button>
    </div>

    <!-- addEmployees -->
    <div
      v-if="name === 'addEmployees'"
      class="flex flex-col items-center"
    >
      <div
        class="taskName leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
      >
        Добавьте сотрудников
      </div>
      <div class="max-w-[750px]">
        <article class="font-[400] text-[18px] text-left leading-[29px] w-full text-[#4C4C4D] mb-[35px] pl-0">
          <p class="mt-1 mb-1">
            Для успешного использования Лидертаск Вам необходимо добавить сотрудников.
          </p>
          <p class="mt-1 mb-1">
            После добавления сотрудников Вы сможете поручать им задачи, а Лидертаск сможет самостоятельно им напоминать звонками, смс и сообщениями в телеграмм о том, чтобы Ваши задачи были сделаны в срок.
          </p>
          <p class="mt-1">
            Посмотрите, как Лидертаск помогает завершать задачи в срок:
          </p>
        </article>
      </div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/Jx-TBirC_Cc"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="border rounded-xl"
      />
      <button
        v-if="name === 'addEmployees'"
        class="w-[238px] mt-[35px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
        @click="clickAddEmployees"
      >
        Добавить сотрудников
      </button>
    </div>

    <!-- addReglaments -->
    <div
      v-if="name === 'addReglaments'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
        >
          Добавьте ваши правила и регламенты
        </div>
        <div>
          <article class="font-[400] text-[18px] text-left leading-[29px] w-full text-[#4C4C4D] mb-[35px] pl-0">
            <p class="mt-1 mb-3">
              Лидертаск может обучать и аттестовывать ваших сотрудников. Для этого необходимо один раз написать инструкции и Лидертаск будет проводить аттестацию ваших сотрудников самостоятельно.
            </p>
            <ol class="list-decimal mt-1 mb-1 ml-5">
              <li>Создаем регламенты. Мы уже добавили Вам несколько стандартных регламентов. Можете потренироваться на них.</li>
              <li>Создаем отделы к которым привязаны эти регламенты</li>
              <li>Добавляем сотрудников в нужные отделы - все теперь Лидертаск сам проследит чтобы все изучили правила и сдали тест на их знание. Все новые сотрудники будут проходить аттестацию по тем правилам, которые определены в его отделе.</li>
            </ol>
          </article>
        </div>
      </div>
      <button
        class="w-[238px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
        @click="clickAddReglament"
      >
        Создать регламент
      </button>
    </div>

    <!-- delegateTasks -->
    <div
      v-if="name === 'delegateTasks'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
        >
          Поручите задачи
        </div>
        <div>
          <article class="font-[400] text-[18px] leading-[29px] text-left w-full text-[#4C4C4D] mb-[35px] pl-0">
            Поручите задачи вашим сотрудникам. Это можно сделать так:
            <ol class="list-decimal mt-1 mb-1 ml-5">
              <li>написать задачу в верхнем поле</li>
              <li>через мастер по кнопке "добавить задачу"</li>
            </ol>
            <p class="mt-1 mb-1">
              ЛидерТаск сам будет следить за выполнением задачи вашим сотрудником и в случае простоя - звонить и писать сообщения сотруднику, если сотрудник не будет отвечать - Вы получите звонок и сообщение.
            </p>
            <p class="mt-1 mb-1">
              Таким образом вы сможете принять решение о невыполненной работы ДО дедлайна когда будет уже поздно.
            </p>
            <p class="mt-1 mb-1">
              Поручайте задачи в Лидертаск и экономьте свое время - получайте готовые задачи до срока!
            </p>
          </article>
        </div>
      </div>
      <button
        v-if="name === 'delegateTasks'"
        class="w-[238px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-normal"
        @click="showInspector = true"
      >
        Поручить задачу
      </button>
    </div>
  </div>
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
    name: {
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
      this.$router.push('/account')
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
      this.$router.push('/employees')
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
    },
    clickAddReglament () {
      this.$emit('nextTask')
      this.$store.commit(NAVIGATOR_SUCCESS)
      this.$store.commit('basic', { key: 'mainSectionState', value: 'greed' })
      this.$store.commit('basic', { key: 'greedPath', value: 'reglaments' })
      this.$router.push('/reglaments')
      const navElem = {
        name: 'Регламенты',
        key: 'greedSource',
        greedPath: 'reglaments',
        value: this.storeNavigator.reglaments
      }
      this.$store.commit('updateStackWithInitValue', navElem)
      this.$store.commit('basic', { key: 'greedSource', value: this.storeNavigator.reglaments.items })
    }
  }
}
</script>
