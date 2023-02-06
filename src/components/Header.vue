<template>
  <header>
    <MegaMenu :model="items" />
  </header>
</template>
<script>
import MegaMenu from 'primevue/megamenu'

export default {
  components: { MegaMenu },
  data() {
    return {
      items: [
        {
          label: 'Grafica de Reportes por Distrito y Año',
          icon: 'pi pi-fw pi-chart-line',
          to: '/',
        },
        {
          label: 'Reporte General',
          icon: 'pi pi-fw pi-table',
          to: '/reportes',
        },
        {
          label: 'Reporte Table',
          icon: 'pi pi-fw pi-table',
          to: '/reporte',
        },
      ],
    }
  },
}
</script>
