<!-- src/views/Machines.vue -->
<template>
    <div>
      <h1>Machines</h1>
      <MachineList :machines="machines" />
    </div>
  </template>
  
  <script>
  import MachineList from '@/components/MachineList.vue';
  import { machines } from '../data.js';
  
  export default {
    components: {
      MachineList
    },
    data() {
      return {
        machines: machines
      };
    }
  };
  </script>
  