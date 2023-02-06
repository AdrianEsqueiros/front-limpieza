<template>
  <h2 class="center">
    Promedio de calificacion por Limpieza y Delincuencia por Distrito en un Año
  </h2>
  <h3 class="center">
    Rate: 0 : Muy Inseguro o Muy Sucio / 10 : Muy Seguro o Muy Limpio
  </h3>
  <div class="formgroup-inline center" style="margin-bottom: 2rem;">
    <Dropdown
      style="width: 20em; margin-right: 10px;"
      v-model="selectedDistrict"
      :options="districts"
      optionLabel="text"
      placeholder="Select a District"
    />
    <Dropdown
      v-model="selectedYear"
      :options="years"
      optionLabel="text"
      placeholder="Select a Year"
      style="width: 20em;"
    />
  </div>

  <div style="width: 99vw; height: 70vh; margin: 0;" class="center">
    <div v-if="!loaded && selectedDistrict">
      <ProgressSpinner class="center" />
      <h3 class="center">Cargando ...</h3>
    </div>

    <Line v-if="loaded" :data="chartData" />
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

import ReportApiServices from '../services/ReportApiServices'
import YearsApiServices from '../services/YearApiServices'
import DistrictApiServices from '../services/DistrictApiServices'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)
export default {
  components: { Line, Dropdown, ProgressSpinner },
  data() {
    return {
      selectedYear: null,
      selectedDistrict: null,
      years: [],
      districts: [],
      rateData: [],
      dataDelincuencia: {},
      loaded: false,
      chartData: {
        labels: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        datasets: [
          {
            label: 'Limpieza',
            backgroundColor: '#f87979',
            data: [null],
          },
          {
            label: 'Delincuencia',
            backgroundColor: '#52fddd',
            data: [null],
          },
        ],
      },
    }
  },
  async created() {
    await this.getYears()
    await this.getDistricts()
  },
  computed: {},
  async mounted() {
    // this.getChartData()
  },
  methods: {
    async getDistricts() {
      try {
        let districtData = await DistrictApiServices.getDistricts()
        districtData = districtData.data
        for (const district of districtData) {
          this.districts.push({
            text: district.district_name,
            value: district.id,
          })
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getYears() {
      try {
        let yearsData = await YearsApiServices.getYears()
        yearsData = yearsData.data
        for (const year of yearsData) {
          this.years.push({ text: year.year_date, value: year.id })
        }
      } catch (e) {
        console.error(e)
      }
    },
    async getChartData() {
      this.loaded = false
      try {
        let reportData = await ReportApiServices.getGraphicReport({
          districtId: this.selectedDistrict.value,
          yearId: this.selectedYear.value,
        })
        reportData = reportData.data
        for (const report of reportData) {
          if (report.category_name === 'Limpieza') {
            this.chartData.datasets[0].data[report.month - 1] = report.avg_rate
          } else if (report.category_name === 'Delincuencia') {
            this.chartData.datasets[1].data[report.month - 1] = report.avg_rate
          }
          // this.chartData.datasets[0].data.push(report.avg_rate)
          // this.chartData.datasets[1].data.push(report.avg_rate)
        }
        this.loaded = true
      } catch (e) {
        console.error(e)
      }
    },
  },
  watch: {
    selectedYear: {
      immediate: true,
      handler() {
        if (this.selectedDistrict) this.getChartData()
      },
    },
    selectedDistrict: {
      immediate: true,
      handler() {
        if (this.selectedYear) this.getChartData()
      },
    },
  },
}
</script>
<style>
body {
  background-color: #f5f5f5;
}
.center {
  justify-content: center;
  display: flex;
}
</style>
