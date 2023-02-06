<template>
  <div class="center">
    <DataTable
      :value="reportData"
      ref="dt"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="25"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[25, 50, 100]"
      dataKey="id"
      filterDisplay="row"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      v-model:filters="filters"
    >
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

      <Column field="year" header="Año" style="min-width: 2rem;">
        <template #body="{data}">
          {{ data.year }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            :placeholder="`Search by year - `"
            v-tooltip.top.focus="'Hit enter key to filter'"
          />
        </template>
      </Column>
      <Column field="district" header="Distrito" style="min-width: 2rem;">
        <template #body="{data}">
          {{ data.district }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            :placeholder="`Search by district - `"
            v-tooltip.top.focus="'Hit enter key to filter'"
          />
        </template>
      </Column>
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
import { FilterMatchMode } from 'primevue/api'

import ReportApiServices from '../services/ReportApiServices'
import YearsApiServices from '../services/YearApiServices'
import DistrictApiServices from '../services/DistrictApiServices'

export default {
  components: {},
  data() {
    return {
      years: [],
      districts: [],

      filters: {
        year: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        district: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      loaded: false,
      columns: [
        { field: 'total', header: 'Total de Denuncias' },
        { field: 'avg_rate', header: 'Promedio de Calificacion' },
        { field: 'porcentaje', header: 'Porcentaje de Objetivos' },
      ],
      reportData: [],
    }
  },
  async created() {
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

    async getChartData() {
      try {
        this.loaded = false

        let reportData = await ReportApiServices.getGeneralReports()
        reportData = reportData.data

        let districtData = await DistrictApiServices.getDistricts()
        districtData = districtData.data

        let yearData = await YearsApiServices.getYears()
        yearData = yearData.data

        this.reportData = await reportData.map((report) => {
          let district = districtData.find((d) => d.id === report.district)
          let year = yearData.find((y) => y.id === report.year)

          return {
            district: district.district_name,
            year: year.year_date,
            total: report.total,
            avg_rate: report.avg_rate,
            porcentaje: report.porcentaje,
          }
        })

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
