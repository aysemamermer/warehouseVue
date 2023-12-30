import { createRouter, createWebHistory } from 'vue-router';
import Machines from '@/views/Machines.vue'; // Machines sayfasının olduğu dosya
import Equipments from '@/views/Equipments.vue'; // Equipments sayfasının olduğu dosya

const routes = [
  {
    path: '/machines',
    name: 'Machines',
    component: Machines,
  },
  {
    path: '/equipments',
    name: 'Equipments',
    component: Equipments,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
