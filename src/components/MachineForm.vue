<template>
  <div v-if="visible">
    <h2>{{ machine ? 'Edit Machine' : 'Add Machine' }}</h2>
    <form @submit.prevent="handleSubmit">
      <label>Name:</label>
      <input v-model="formData.name" required>

      <label>Inventory Number:</label>
      <input v-model="formData.inventoryNumber" required>

      <label>Location:</label>
      <input v-model="formData.location" required>

      <!-- New "Description" Field -->
      <label>Description:</label>
      <textarea v-model="formData.description"></textarea>

      <button type="submit">{{ machine ? 'Save Changes' : 'Add Machine' }}</button>
      <button type="button" @click="closeForm">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    machine: Object, // The machine to edit (if any)
    visible: Boolean, // Visibility flag
  },
  data() {
    return {
      formData: {
        name: '',
        inventoryNumber: '',
        location: '',
        description: '', // New "Description" Field
      },
    };
  },
  watch: {
    machine: {
      handler: 'populateFormData',
      immediate: true,
    },
  },
  methods: {
    populateFormData(newMachine) {
      if (newMachine) {
        // If editing, populate form data with existing machine details
        this.formData = { ...newMachine };
      } else {
        // If adding a new machine, reset form data
        this.formData = {
          name: '',
          inventoryNumber: '',
          location: '',
          description: '', // Initialize the description field
        };
      }
    },
    handleSubmit() {
      if (this.machine) {
        this.updateMachine();
      } else {
        this.addMachine();
      }
    },
    addMachine() {
      axios.post('http://127.0.0.1:8000/api/machines/', this.formData)
        .then(response => {
          this.$emit('add', response.data); // Notify the parent component about the new machine
          this.closeForm();
          // Sayfayı yeniden yükle
          location.reload();
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    },
    updateMachine() {
      axios.put(`http://127.0.0.1:8000/api/machines/${this.machine.id}/`, this.formData)
        .then(response => {
          this.closeForm();
          // Sayfayı yeniden yükle
          location.reload();
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    },
    closeForm() {
      this.$emit('close'); // Notify the parent component to close the form
    },
  },
};
</script>

<style scoped>
/*  component styles  */
</style>
