<template>
    <div>
      <h1>Machines</h1>
      <button @click="openAddForm">Add Machine</button>
  
      <ul>
        <li v-for="machine in machines" :key="machine.id">
          <div v-for="(value, key) in machine" :key="key">
            {{ key }}: {{ value }}
          </div>
          <button @click="editMachine(machine)">Edit</button>
          <button @click="deleteMachine(machine.id)">Delete</button>
        </li>
      </ul>
  
      <!-- Makine ekleme veya düzenleme formu içeriği -->
      <machine-form
        :machine="selectedMachine"
        :visible="isFormVisible"
        @add="addMachine"
        @update="updateMachine"
        @close="closeForm"
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
        isFormVisible: false,
        selectedMachine: null,
        formData: {
          name: '',
          inventoryNumber: '',
          location: '',
          description: '',  
        },
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
      openAddForm() {
        // Yeni makine ekleme formunu aç
        this.selectedMachine = null;
        this.isFormVisible = true;
      },
      editMachine(machine) {
        this.selectedMachine = machine;
        this.isFormVisible = true;
      },
      addMachine(newMachine) {
  console.log('New Machine Data:', newMachine);

  axios.post('http://127.0.0.1:8000/api/machines/', newMachine)
    .then(response => {
      const newMachineId = response.data.id;
      
      this.$router.push({ name: 'MachineDetail', params: { id: newMachineId } });

      this.fetchMachines();
      this.closeForm();
    })
    .catch(error => {
      console.error('API Error:', error);
    });
},

      updateMachine(updatedMachine) {
        axios.put(`http://127.0.0.1:8000/api/machines/${updatedMachine.id}/`, updatedMachine)
          .then(response => {
            this.fetchMachines();
            this.closeForm();
          })
          .catch(error => {
            console.error('API Error:', error);
          });
      },
      deleteMachine(machineId) {
        if (confirm('Are you sure you want to delete this machine?')) {
          axios.delete(`http://127.0.0.1:8000/api/machines/${machineId}/delete/`)
            .then(response => {
              this.fetchMachines();
            })
            .catch(error => {
              console.error('API Error:', error);
            });
        }
      },
      closeForm() {
        this.isFormVisible = false;
        this.selectedMachine = null;
        this.formData = {
          name: '',
          inventoryNumber: '',
          location: '',
          description: '',
        };
      },
    },
    components: {
      MachineForm,
    },
  };
  </script>
  