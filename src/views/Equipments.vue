<!-- src/components/Equipment.vue -->
<template>
    <div>
      <h2>Equipment Details</h2>
      <ul>
        <li>{{ equipment.name }} - {{ equipment.inventoryNumber }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      equipment: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  