<!-- MachineList.vue-->


<template>
    <div>
      <h1>Machines</h1>
      <ul>
        <li v-for="machine in machines" :key="machine.id">
          {{ machine.name }} - {{ machine.inventoryNumber }} - {{ machine.location }}
          <button @click="editMachine(machine)">Edit</button>
          <button @click="deleteMachine(machine.id)">Delete</button>
        </li>
      </ul>
  
      <machine-form
        :machine="selectedMachine"
        :visible="isEditFormVisible"
        @close="closeEditForm"
        @update="fetchMachines"
      ></machine-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import MachineForm from '@/components/MachineForm.vue';
  
  export default {
    data() {
      return {
        machines: [],
        isEditFormVisible: false,
        selectedMachine: null,
      };
    },
    mounted() {
      this.fetchMachines();
    },
    methods: {
      fetchMachines() {
        axios.get('http://127.0.0.1:8000/api/machines/')
          .then(response => {
            this.machines = response.data;
          })
          .catch(error => {
            console.error('API Error:', error);
          });
      },
      editMachine(machine) {
        this.selectedMachine = machine;
        this.isEditFormVisible = true;
      },
      deleteMachine(machineId) {
        if (confirm('Are you sure you want to delete this machine?')) {
          axios.delete(`http://127.0.0.1:8000/api/machines/${machineId}/delete`)
            .then(response => {
              this.fetchMachines();
            })
            .catch(error => {
              console.error('API Error:', error);
            });
        }
      },
      closeEditForm() {
        this.isEditFormVisible = false;
        this.selectedMachine = null;
      },
    },
    components: {
      MachineForm,
    },
  };
  </script>
  