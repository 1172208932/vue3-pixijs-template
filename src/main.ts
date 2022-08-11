import './utils/polyfills' 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'


const app = createApp(App)

// 2.装载路由
app.use(router)

app.mount('#app')