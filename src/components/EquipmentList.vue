<!-- src/components/EquipmentList.vue -->
<template>
    <div>
      <h1>Equipments</h1>
      <ul>
        <li v-for="equipment in equipments" :key="equipment.id">
          {{ equipment.name }} - {{ equipment.inventoryNumber }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { equipments } from '../data.js';
  
  export default {
    data() {
      return {
        equipments: equipments
      };
    }
  };
  </script>
  