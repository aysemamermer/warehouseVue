
// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css'

// Stil dosyalarını projeye ekleyin

const app = createApp(App);

app.use(router);
app.mount('#app');



