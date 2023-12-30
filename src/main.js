
// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Stil dosyalarını projeye ekleyin

const app = createApp(App);

app.use(router);
app.mount('#app');



