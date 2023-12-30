import { createRouter, createWebHistory } from 'vue-router';
import Machines from '../views/Machines.vue';
import Equipments from '../views/Equipments.vue';

const routes = [
  {
    path: '/machines',
    name: 'Machines',
    component: Machines
  },
  {
    path: '/equipments',
    name: 'Equipments',
    component: Equipments
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
