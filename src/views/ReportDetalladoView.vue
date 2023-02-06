<template>
  <div class="center">
    <DataTable
      :value="reportData"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      dataKey="id"
      ref="dt"
      filterDisplay="row"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      class="p-datatable-customers"
      v-model:filters="filters"
    >
      <template #header>
        <h2 class="">Reporte Detallado</h2>

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
      <Column field="id" header="Report Id" style="min-width: 12rem;">
        <template #body="{data}">
          {{ data.id }}
        </template>
      </Column>
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
      <Column field="category" header="Categoria" style="min-width: 12rem;">
        <template #body="{data}">
          {{ data.category }}
        </template>
        <template #filter="{filterModel,filterCallback}">
          <InputText
            type="text"
            v-model="filterModel.value"
            @keydown.enter="filterCallback()"
            class="p-column-filter"
            :placeholder="`Search by category - `"
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
      <Column header="Photo" field="photo" key="">
        <template #body="{data}">
          <img :src="data.photos" width="100" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator from 'primevue/paginator'
import { FilterMatchMode } from 'primevue/api'
import DataTable from 'primevue/datatable'
import ReportApiServices from '../services/ReportApiServices'
import YearsApiServices from '../services/YearApiServices'
import DistrictApiServices from '../services/DistrictApiServices'

export default {
  components: {
    DataTable,
    Button,
    Dropdown,
    Column,
    ProgressSpinner,
    Paginator,
  },
  data() {
    return {
      loading: true,
      years: [],
      districts: [],
      loaded: false,
      filters: {
        year: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        district: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      categories: [
        {
          value: 1,
          text: 'Limpieza',
        },
        {
          value: 2,
          text: 'Delincuencia',
        },
      ],
      columns: [
        { field: 'first_name', header: 'Nombre' },
        { field: 'last_name', header: 'Apellido' },
        { field: 'comments', header: 'Comentario' },
        { field: 'rate', header: 'Calificacion ' },
      ],
      reportData: [],
    }
  },
  async created() {
    await this.getChartData()
  },
  computed: {},
  async mounted() {},
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV()
    },
    async getChartData() {
      try {
        this.loaded = false

        let reportData = await ReportApiServices.getDetailReport({
          npage: 1,
          perpage: 100000,
          yearId: null,
        })
        reportData = reportData.data

        let districtData = await DistrictApiServices.getDistricts()
        districtData = districtData.data

        let yearData = await YearsApiServices.getYears()
        yearData = yearData.data

        this.reportData = reportData.map((report) => {
          let district = districtData.find((d) => d.id === report.district_id)
          let year = yearData.find((y) => y.id === report.year_id)
          let category = this.categories.find(
            (c) => c.value === report.category_id,
          )
          return {
            id: report.id,
            district: district.district_name,
            year: year.year_date,
            comments: report.comments,
            first_name: report.first_name,
            last_name: report.last_name,
            photos: report.photos,
            rate: report.rate,
            category: category.text,
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
