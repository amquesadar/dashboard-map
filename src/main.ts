import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/app.css'
import '@/assets/main.css'   // ← now includes Tailwind + globals

createApp(App)
  .use(router)
  .mount('#app')
