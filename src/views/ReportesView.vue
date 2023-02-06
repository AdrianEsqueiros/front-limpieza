<template>
  <div class="center">
    <DataTable :value="reportData" ref="dt" responsiveLayout="scroll">
      <template #header>
        <h2 class="">Reporte General</h2>

        <div v-if="!loaded">
          <ProgressSpinner class="center" />
          <h3 class="center">Cargando ...</h3>
        </div>
        <div>
          <div style="text-align: left;">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV($event)"
            />
            <div style="text-align: right;">
              {{ reportData.length }}
              {{ reportData.length === 1 ? 'Result' : 'Results' }}
            </div>
          </div>
        </div>
      </template>
      <template #loading>
        Loading customers data. Please wait.
      </template>

      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'

import DataTable from 'primevue/datatable'
import ReportApiServices from '../services/ReportApiServices'
import YearsApiServices from '../services/YearApiServices'
import DistrictApiServices from '../services/DistrictApiServices'

export default {
  components: { DataTable, Button, Dropdown, Column, ProgressSpinner },
  data() {
    return {
      years: [],
      districts: [],
      rateData: [],
      loaded: false,
      columns: [
        { field: 'id', header: 'Id' },
        { field: 'year', header: 'Año' },
        { field: 'district', header: 'Distrito' },
        { field: 'total', header: 'Total de Denuncias' },
        { field: 'avg_rate', header: 'Promedio de Calificacion' },
        { field: 'porcentaje', header: 'Porcentaje de Objetivos' },
      ],
      reportData: [],
    }
  },
  async created() {
    await this.getYears()
    await this.getDistricts()
    await this.getChartData()
  },
  computed: {},
  async mounted() {
    // this.getChartData()
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
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
      try {
        this.loaded = false

        let reportData = await ReportApiServices.getGeneralReports()
        reportData = reportData.data
        for (const district of this.districts) {
          for (const year of this.years) {
            let total = 0
            let avg_rate = 0
            let porcentaje = 0
            for (const report of reportData) {
              if (
                report.district === district.value &&
                report.year === year.value
              ) {
                total = report.total
                avg_rate = report.avg_rate
                porcentaje = report.porcentaje
              }
            }
            this.reportData.push({
              id: this.reportData.length + 1,
              total: total,
              district: district.text,
              year: year.text,
              avg_rate: avg_rate,
              porcentaje: porcentaje,
            })
          }
        }
        this.loaded = true
      } catch (e) {
        console.error(e)
      }
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
