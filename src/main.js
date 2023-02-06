import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Tooltip from 'primevue/tooltip'

import 'primevue/resources/themes/nova/theme.css' //theme
import 'primevue/resources/primevue.min.css' //core css
import 'primeicons/primeicons.css '

const app = createApp(App)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.component('InputText', InputText)

app.use(router)

app.mount('#app')
