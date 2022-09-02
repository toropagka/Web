<template>
  <DatePicker
    dot="true"
    class="border-none calendar-nav-custom"
    :style="{ backgroundColor: datePickerBG }"
    show-weeknumbers="left"
    days="-1"
    color="#CCC"
    week-from-end="6"
    is-expanded
    :locale="getNavigatorLanguage"
    :masks="{ weekdays: 'WWW' }"
    :attributes="attrs"
    :is-dark="isDark"
    mode="single"
    is-inline
    in-next-month="true"
    in-month="true"
    in-prev-month="true"
    @dayclick="onDayClick"
  />
</template>

<script>
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

export default {
  components: {
    DatePicker
  },
  emits: ['dayclick'],
  data () {
    return {
      newDayTimerID: 0
    }
  },
  computed: {
    attrs () {
      return this.$store.getters.attrsCalendar
    },
    lastNavStack () {
      return this.$store.getters.lastNavStackElement
    },
    getNavigatorLanguage () {
      return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en'
    },
    isDark () {
      return this.$store.state.darkMode
    },
    datePickerBG () {
      return this.isDark ? 'rgb(31 41 55)' : '#f4f5f7'
    }
  },
  mounted () {
    this.setLastPickedDate()
    //
    let currDate = new Date()
    currDate.setHours(0, 0, 0, 0)
    this.newDayTimerID = setInterval(() => {
      const newDate = new Date()
      newDate.setHours(0, 0, 0, 0)
      if (currDate.getTime() !== newDate.getTime()) {
        currDate = newDate
        this.onNewDay()
      }
    }, 1000)
  },
  beforeUnmount () {
    clearInterval(this.newDayTimerID)
  },
  methods: {
    setLastPickedDate () {
      if (this.lastNavStack?.value?.uid === '901841d9-0016-491d-ad66-8ee42d2b496b') {
        this.$store.commit('setCalendarLastPicked', this.lastNavStack.value.param)
      }
    },
    onNewDay () {
      this.$store.commit('updateCalendarToday')
    },
    onDayClick (day) {
      this.$emit('dayclick', day.id)
    }
  }
}
</script>

<style>
.vc-container.calendar-nav-custom
{
  @apply font-roboto;
}

.calendar-nav-custom .vc-weeknumber-content {
  @apply bg-white rounded-[6px] text-[#8b64bd] not-italic text-[11px] mt-0 mr-[2px] h-[24px] w-[24px];
}

.calendar-nav-custom .vc-weeks {
  @apply p-0;
}

.calendar-nav-custom .vc-arrow {
  @apply text-[#424242] w-[32px] h-[32px];
}

.calendar-nav-custom .vc-title {
  @apply text-[#424242] capitalize text-[15px] font-bold;
}

.calendar-nav-custom .vc-weekday {
  @apply text-[#424242] capitalize text-[12px] h-[34px] pt-0 pb-0 flex items-center justify-center font-bold;
}
.calendar-nav-custom .vc-weekday:nth-child(7), .vc-weekday:nth-child(8)
{
  @apply text-[#e23300];
}

.calendar-nav-custom .vc-header
{
  @apply mb-[2px] h-[32px] p-0;
}

.calendar-nav-custom .vc-arrows-container
{
  @apply h-[32px] p-0;
}

.calendar-nav-custom .vc-day
{
  @apply min-h-[30px] h-[30px] w-[30px];
}

.calendar-nav-custom .vc-day-content:focus
{
  @apply bg-[#ff9123]/70 !important;
}

.calendar-nav-custom .vc-highlight,
.calendar-nav-custom .vc-highlight:focus
{
  @apply bg-[#ff9123]/50;
}

.calendar-nav-custom .vc-day-content,
.calendar-nav-custom .vc-highlight
{
  @apply rounded-[8px] w-[30px] h-[30px] border-[#ff9123]/40 text-[#424242] text-[12px] font-medium !important;
}

.calendar-nav-custom .is-not-in-month .vc-day-content,
.calendar-nav-custom .is-not-in-month .vc-highlights,
.calendar-nav-custom .is-not-in-month .vc-day-layer,
.calendar-nav-custom .is-not-in-month .vc-highlight
{
  @apply opacity-100 pointer-events-auto text-black/50 !important;
}

.calendar-nav-custom .vc-day.weekday-7:not(.is-not-in-month) .vc-day-content,
.calendar-nav-custom .vc-day.weekday-1:not(.is-not-in-month) .vc-day-content
{
  @apply text-red-500 !important;
}

.calendar-nav-custom .dots-back
{
  background-color: #444444!important;
  height: 3px !important;
  width: 3px !important;
  position: relative !important;
  top: 11px !important;
  border-radius: 9999px !important;
}
</style>
