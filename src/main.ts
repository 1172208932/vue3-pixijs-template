import './utils/polyfills' 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from "./store";
import {VueMasonryPlugin} from 'vue-masonry';
import naive from "naive-ui";

const app = createApp(App)
app
    .use(VueMasonryPlugin)
    .use(store)
    .use(router)
    .use(naive)

    .mount('#app')