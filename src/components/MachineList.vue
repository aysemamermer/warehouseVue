<!-- src/components/MachineList.vue -->
<template>
    <div>
      <h1>Machines</h1>
      <ul>
        <li v-for="machine in machines" :key="machine.id">
          {{ machine.name }} - {{ machine.inventoryNumber }} - {{ machine.location }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { machines } from '../data.js';
  
  export default {
    data() {
      return {
        machines: machines
      };
    }
  };
  </script>
  