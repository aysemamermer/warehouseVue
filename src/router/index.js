
import { createRouter, createWebHistory } from 'vue-router';
import Machines from '@/views/Machines.vue';
import Equipments from '@/views/Equipments.vue';
import Home from '@/views/Home.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
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
