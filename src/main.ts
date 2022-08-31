import './utils/polyfills' 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from "./store";
import {VueMasonryPlugin} from 'vue-masonry';

const app = createApp(App)
app
    .use(VueMasonryPlugin)
    .use(store)
    .use(router)
    .mount('#app')