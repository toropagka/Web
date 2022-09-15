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
        class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
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
        src="https://www.youtube.com/embed/97CjkmN_YjE"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="border rounded-xl"
      />
      <SlideBodyButton
        class="mt-[35px]"
        text="Понятно"
        @click="clickSuccess"
      />
    </div>

    <!-- addAvatar -->
    <div
      v-if="name === 'addAvatar'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
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
      <SlideBodyButton
        text="Загрузить"
        @click="clickAddAvatar"
      />
    </div>

    <!-- addEmployees -->
    <div
      v-if="name === 'addEmployees'"
      class="flex flex-col items-center"
    >
      <div
        class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
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
      <SlideBodyButton
        class="mt-[35px]"
        text="Добавить сотрудников"
        @click="clickAddEmployees"
      />
    </div>

    <!-- addReglaments -->
    <div
      v-if="name === 'addReglaments'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
        >
          Добавьте ваши правила и регламенты
        </div>
        <div>
          <article class="font-[400] text-[18px] text-left leading-[29px] w-full text-[#4C4C4D] mb-[35px] pl-0">
            <p class="mt-1 mb-3">
              Лидертаск может обучать и аттестовывать ваших сотрудников. Для этого необходимо один раз написать инструкции и Лидертаск будет проводить аттестацию ваших сотрудников самостоятельно.
            </p>
            <ol class="list-decimal mt-1 mb-1 ml-5">
              <li>Создаем регламенты;</li>
              <li>создаем отделы, к которым привязаны эти регламенты;</li>
              <li>добавляем сотрудников в нужные отделы - все теперь Лидертаск сам проследит, чтобы все изучили правила и сдали тест на их знание. Все новые сотрудники будут проходить аттестацию по тем правилам, которые определены в его отделе.</li>
            </ol>
          </article>
        </div>
      </div>
      <SlideBodyButton
        text="Создать регламент"
        @click="clickAddReglament"
      />
    </div>

    <!-- delegateTasks -->
    <div
      v-if="name === 'delegateTasks'"
      class="w-8/12"
    >
      <div class="flex flex-col items-center">
        <div
          class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 overflow-x-hidden w-full text-[25px] font-bold mb-[28px]"
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
      <SlideBodyButton
        v-if="name === 'delegateTasks'"
        text="Поручить задачу"
        @click="showInspector = true"
      />
    </div>
  </div>
</template>
<script>
import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import SlideBodyButton from './SlideBodyButton.vue'
import { NAVIGATOR_SUCCESS } from '@/store/actions/navigator'
import * as SLIDES from '@/store/actions/slides.js'
export default {
  components: {
    InspectorModalBox,
    SlideBodyButton
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
      this.$router.push('/account/myaccount')
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    clickSuccess () {
      this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'welcome', visible: false })
      this.$emit('nextTask')
    },
    clickAddEmployees () {
      this.$emit('nextTask')
      this.$router.push('/settings/employees')
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    clickAddReglament () {
      this.$emit('nextTask')
      this.$router.push('/reglaments')
      this.$store.commit(NAVIGATOR_SUCCESS)
    }
  }
}
</script>
