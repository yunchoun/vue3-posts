import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/assets/css/font.css';
import '@/assets/css/base.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(router).component("apexchart",VueApexCharts).mount('#app')

import 'bootstrap/dist/js/bootstrap.js';

