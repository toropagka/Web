import * as SLIDES from '@/store/actions/slides.js'

const state = {
  slides: [
    {
      name: 'welcome',
      mode: 'slide',
      title: 'Добро пожаловать в ЛидерТаск Web!',
      video: 'https://www.youtube.com/embed/FbdQZihaWqQ',
      visible: JSON.parse(localStorage.getItem('slides'))?.welcome ?? true
    },
    {
      name: 'addAvatar',
      mode: 'slide',
      title: 'Установите фото профиля (аватар) в ЛидерТаск',
      text: `<div class="mb-[25px]">
      1. Аватар поможет вашим коллегам быстрее найти Вас в списках (особенно, когда в вашей команде есть сотрудники с одинаковыми именами)<br>
      2. Это просто эстетично и гораздо лучше стандартной серой картинки`,
      video: '',
      visible: JSON.parse(localStorage.getItem('slides'))?.addAvatar ?? true
    },
    {
      name: 'addEmployees',
      mode: 'slide',
      title: 'Добавьте сотрудников',
      text: `<p class="mt-1 mb-1">Для успешного использования Лидертаск Вам необходимо добавить сотрудников.</p>
      <p class="mt-1 mb-1">После добавления сотрудников Вы сможете поручать им задачи, а Лидертаск сможет самостоятельно им напоминать звонками, смс и сообщениями в телеграмм о том, чтобы Ваши задачи были сделаны в срок.</p>
      <p class="mt-1 mb-1">Подключить сотрудников.</p>
      <p class="mt-1 mb-1">Посмотрите, как Лидертаск помогает завершать задачи в срок:</p>`,
      video: 'https://www.youtube.com/embed/Jx-TBirC_Cc',
      visible: JSON.parse(localStorage.getItem('slides'))?.addEmployees ?? true
    },
    {
      name: 'addReglaments',
      mode: 'slide',
      title: 'Добавьте ваши правила и регламенты',
      text: `<p class="mt-1 mb-1">Лидертаск может обучать и аттестовывать ваших сотрудников. Для этого необходимо один раз написать инструкции и Лидертаск будет проводить аттестацию ваших сотрудников самостоятельно.</p>
      <ol class="list-decimal mt-1 mb-1">
      <li>Создаем регламенты. Мы уже добавили Вам несколько стандартных регламентов. Можете потренироваться на них.</li>
      <li>Создаем отделы к которым привязаны эти регламенты</li>
      <li>Добавляем сотрудников в нужные отделы - все теперь Лидертаск сам проследит чтобы все изучили правила и сдали тест на их знание. Все новые сотрудники будут проходить аттестацию по тем правилам, которые определены в его отделе.</li>
      </ol>`,
      video: '',
      visible: JSON.parse(localStorage.getItem('slides'))?.addReglaments ?? true
    },
    {
      name: 'delegateTasks',
      mode: 'slide',
      title: 'Поручите задачи',
      text: `Поручите задачи вашим сотрудникам. Это можно сделать так:
      <ol class="list-decimal mt-1 mb-1">
      <li>написать задачу в верхнем поле</li>
      <li>через мастер по кнопке "добавить задачу"</li>
      </ol>
      <p class="mt-1 mb-1">ЛидерТаск сам будет следить за выполнением задачи вашим сотрудником и в случае простоя - звонить и писать сообщения сотруднику, если сотрудник не будет отвечать - Вы получите звонок и сообщение.</p>
  <p class="mt-1 mb-1">Таким образом вы сможете принять решение о невыполненной работы ДО дедлайна когда будет уже поздно.</p>
      <p class="mt-1 mb-1">Поручайте задачи в Лидертаск и экономьте свое время - получайте готовые задачи до срока!</p>`,
      video: '',
      visible: JSON.parse(localStorage.getItem('slides'))?.delegateTasks ?? true
    }
  ]
}

const actions = {}

const mutations = {
  [SLIDES.CHANGE_VISIBLE]: (state, value) => {
    for (let i = 0; i < state.slides.length; i++) {
      if (state.slides[i].name === value.name) {
        let data = {}
        try {
          data = JSON.parse(localStorage.getItem('slides'))
          data[value.name] = value.visible
          console.log(data)
        } catch (e) {
          console.log(e)
          data = {
            welcome: true,
            addAvatar: true,
            addEmployees: true,
            addReglaments: true,
            delegateTasks: true
          }
          data[value.name] = value.visible
        }
        state.slides[i].visible = value.visible
        localStorage.setItem('slides', JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem('slides')))
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
