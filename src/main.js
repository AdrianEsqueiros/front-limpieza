import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Tooltip from 'primevue/tooltip'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Paginator from 'primevue/paginator'
import DataTable from 'primevue/datatable'

import 'primevue/resources/themes/nova/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core css
import 'primeicons/primeicons.css '

const app = createApp(App)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Paginator', Paginator)
app.component('Column', Column)
app.component('Button', Button)
app.component('DataTable', DataTable)
app.use(router)

app.mount('#app')
