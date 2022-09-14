<template>
  <NavBar
    class="mt-[8px]"
    title="Карма"
  />
  <!--  -->
  <div
    v-if="user.tarif !== 'alpha' && user.tarif !== 'trial' || $store.getters.isLicenseExpired"
    class="grid grid-cols-1 gap-4 p-5 bg-white rounded mt-2"
  >
    <KarmaNoLicenceWindow />
  </div>
  <div
    v-else
  >
    <KarmaSkeleton v-if="showSkeleton" />
    <div
      v-else
      class="rounded-xl bg-white"
    >
      <p class="text-center p-2">
        <span
          class="text-6xl tracking-tighter"
          :class="{'text-green-500': karmaQuantity, 'text-red-500': !karmaQuantity, 'text-gray-600': karmaQuantity === 0 }"
        >
          <span v-if="karmaQuantity > 0">+</span>
          {{ karmaQuantity }}
        </span>
      </p>
      <p class="text-center mt-2 p-2">
        <span class="text-sm text-gray-600">В срок:</span> <span class="text-xl mr-6 text-green-500"> {{ successQuantity }}</span>
        <span class="text-sm text-gray-600">Просроченныx:</span> <span class="text-xl text-red-500">{{ overdueQuantity }}</span>
      </p>
      <br>
      <div class="grid grid-cols-1 gap-4 p-5">
        <div class="grid grid-cols-1 ">
          <p class="text-center text-2xl font-bold">
            Графики
          </p>
          <p class="text-left text-sm font-semibold px-2.5">
            В срок
          </p>
          <line-chart
            :data="successChartData"
            class="max-h-[120px]"
          />
          <p class="text-left text-sm font-semibold mt-4 px-2.5">
            Просрочено
          </p>
          <line-chart
            :data="overdueChartData"
            class="max-h-[120px]"
          />
        </div>
        <KarmaHistory />
      </div>
    </div>
  </div>
</template>

<script>
import * as chartConfig from '@/components/Charts/chart.config.js'
import KarmaSkeleton from '@/components/Settings/KarmaSkeleton.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import NavBar from '@/components/Navbar/NavBar.vue'
import KarmaNoLicenceWindow from '../AccKarma/KarmaNoLicenceWindow.vue'
import KarmaHistory from '../AccKarma/KarmaHistory.vue'

export default {
  components: {
    NavBar,
    KarmaSkeleton,
    LineChart,
    KarmaNoLicenceWindow,
    KarmaHistory
  },
  data () {
    return {
      successChartData: null,
      overdueChartData: null,
      showSkeleton: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    currentLocation () {
      return window.location.href
    },
    karmaList () {
      return this.$store.state.inspector.karma
    },
    karmaQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) quantity += karma.points
      return quantity
    },
    successQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) {
        if (karma.points > 0) {
          quantity += 1
        }
      }
      return quantity
    },
    overdueQuantity () {
      let quantity = 0
      for (const karma of this.karmaList) {
        if (karma.points < 0) {
          quantity += 1
        }
      }
      return quantity
    }
  },
  mounted () {
    this.$store.dispatch('KARMA_REQUEST', this.user?.current_user_uid).then((resp) => {
      const success = []
      const overdue = []
      for (const karma of resp.data) {
        if (karma.points > 0) success.push(karma)
        else if (karma.points < 0) overdue.push(karma)
      }
      this.successChartData = chartConfig.karmaChartData(success, 'success')
      this.overdueChartData = chartConfig.karmaChartData(overdue, 'danger')
      this.showSkeleton = false
    })
  }
}
</script>
