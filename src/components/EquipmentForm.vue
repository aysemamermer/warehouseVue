<template>
  <div>
    <h2>{{ equipment.id ? 'Edit Equipment' : 'Add Equipment' }}</h2>
    <form @submit.prevent="saveEquipment">
      <label>Name:</label>
      <input v-model="equipment.name" required>

      <label>Inventory Number:</label>
      <input v-model="equipment.inventoryNumber" required>

      <label>Machine:</label>
      <select v-model="equipment.machine.id">
        <option v-for="machineOption in machineOptions" :key="machineOption.id" :value="machineOption.id">
          {{ machineOption.name }}
        </option>
      </select>

      <button type="submit">{{ equipment.id ? 'Save Changes' : 'Add Equipment' }}</button>
    
    </form>
    <button v-if="equipment.id" @click="openEditForm">Edit Equipment</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      equipment: {
        id: null,
        name: '',
        inventoryNumber: '',
        machine: { id: null, name: '' },
      },
      machineOptions: [],
    };
  },
  mounted() {
    this.fetchMachineOptions();
  },
  methods: {
    fetchMachineOptions() {
      axios.get('http://127.0.0.1:8000/api/machines/')
        .then(response => {
          this.machineOptions = response.data;
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    },
    saveEquipment() {
      const requestData = {
        name: this.equipment.name,
        inventoryNumber: this.equipment.inventoryNumber,
        machineId: this.equipment.machine.id,
      };

      if (this.equipment.id) {
        // Update existing equipment
        axios.put(`http://127.0.0.1:8000/api/equipment/${this.equipment.id}/`, requestData)
          .then(response => {
            console.log('Equipment successfully updated:', response.data);
            this.fetchEquipments();  // Assuming this method is defined somewhere to update the equipment list
            this.closeEditForm();
          })
          .catch(error => {
            console.error('PUT API Error:', error);
          });
      } else {
        // Add new equipment
        axios.post('http://127.0.0.1:8000/api/equipment/', requestData)
          .then(response => {
            console.log('Equipment successfully added:', response.data);
            this.fetchEquipments();  // Assuming this method is defined somewhere to update the equipment list
            this.closeEditForm();
          })
          .catch(error => {
            console.error('POST API Error:', error);
          });
      }
    },

    openEditForm() {
      this.$emit('openEditForm', this.equipment);
    },
  },
};
</script>
