<template>
    <div class="container mt-3">
      
    <div>
    <h1>Machines</h1>
    <div class="button-container">
    <button @click="openAddForm" class="btn btn-primary">Add Machine</button>
    <div class="button-spacing"></div>
    <router-link to="/equipments" class="btn btn-primary">Go to Equipments</router-link>
    </div>
    <div class="spacer"></div>
    <div class="mb-3">
        <label class="form-label">Search:</label>
        <input v-model="searchText" class="form-control">
      </div>
      <div class="spacer"></div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Inventory Number</th>
              <th>Location</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="machine in filteredMachines" :key="machine.id">
              <td>{{ machine.id }}</td>
              <td>{{ machine.name }}</td>
              <td>{{ machine.inventory_number }}</td>
              <td>{{ machine.location }}</td>
              <td>{{ machine.description }}</td>
              <td>
                <div class="button-container">
                  <button @click="showMachineDetails(machine)" class="btn btn-info">Details</button>
                <div class="button-spacing"></div>
                  <button @click="editMachine(machine)" class="btn btn-warning">Edit</button>
                  <div class="button-spacing"></div>
                  <button @click="deleteMachine(machine.id)" class="btn btn-danger">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="spacer-containers"></div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
    <!-- Başarı Mesajı -->
    <div v-if="successMessage" class="alert alert-success mt-4">
      {{ successMessage }}
    </div>
    <machine-form
      :machine="selectedMachine"
      :visible="isFormVisible"
      @add="addMachine"
      @update="updateMachine"
      @close="closeForm"
      :error-message="errorMessage"
      :success-message="successMessage"
    ></machine-form>
    <div v-if="machineDetailsModalVisible">
      <machine-details-modal
        :is-visible="machineDetailsModalVisible"
        :machine-details="machineDetails"
        :connected-equipments="connectedEquipments"
        @close="closeMachineDetailsModal"
      ></machine-details-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MachineForm from '@/components/MachineForm.vue';
import MachineDetailsModal from '@/components/MachineDetailsModal.vue';


export default {
  data() {
    return {
      machineDetailsModalVisible: false,
      machineDetails: {},
      connectedEquipments: [],
      machines: [],
      filteredMachines: [],
      isFormVisible: false,
      selectedMachine: null,
      errorMessage: '',
      successMessage: '',
      successModalVisible: false, // Yeni eklenen başarı modalını kontrol etmek için
      searchText: '',
    };
  },
  mounted() {
    this.fetchMachines();
  },
  computed : {
  filteredMachines() {
    const searchTextLower = this.searchText.toLowerCase().trim();

    return this.machines.filter(machine => {
      return (
        (!searchTextLower || machine.name.toLowerCase().includes(searchTextLower)) ||
        (!searchTextLower || machine.inventory_number.toLowerCase().includes(searchTextLower)) ||
        (!searchTextLower || machine.location.toLowerCase().includes(searchTextLower)) ||
        (!searchTextLower || machine.description.toLowerCase().includes(searchTextLower)) 
       
      );
    });
  }
},
  methods: {

    showMachineDetails(machine) {
      axios
        .get(`http://127.0.0.1:8000/api/machines/${machine.id}/`)
        .then((response) => {
          this.machineDetails = response.data;
          axios
            .get(`http://127.0.0.1:8000/api/machines/${machine.id}/equipments/`)
            .then((equipmentResponse) => {
              this.connectedEquipments = equipmentResponse.data;
              this.machineDetailsModalVisible = true;
              this.closeForm()
            })
            .catch((error) => {
              console.error('API Error:', error);
            });
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    },
    closeMachineDetailsModal() {
      this.machineDetailsModalVisible = false;
      this.machineDetails = {};
      this.connectedEquipments = [];
    },

    async fetchMachines() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/machines/', {
      params: {
        search: this.searchText,
      },
    });
    this.machines = response.data;
    this.filteredMachines = response.data;
  } catch (error) {
    console.error('API Error:', error);
    this.errorMessage = 'An error occurred while fetching machine data.';
  }
},

    openAddForm() {
      this.selectedMachine = null;
      this.isFormVisible = true;
      this.closeMachineDetailsModal()
    },
    editMachine(machine) {
      this.selectedMachine = machine;
      this.isFormVisible = true;
      this.closeMachineDetailsModal() 
    },
    deleteMachine(machineId) {
      if (confirm('Are you sure you want to delete this machine?')) {
        axios
          .delete(`http://127.0.0.1:8000/api/machines/${machineId}/delete/`)
          .then(() => {
            this.fetchMachines();
            this.closeForm()
            this.closeMachineDetailsModal() 

          })
          .catch((error) => {
            console.error('API Error:', error);
          });
      }
    },
    closeForm() {
      this.isFormVisible = false;
      this.selectedMachine = null;
      this.successMessage = '';
    },
    addMachine() {
      this.successMessage = 'Machine added successfully!';
      this.fetchMachines();
      this.successModalVisible = true;
    },
    updateMachine() {
      this.successMessage = 'Machine updated successfully!';
      this.fetchMachines();
      this.successModalVisible = true;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
    },
  },
  watch: {
    searchText(newText) {
      this.filteredMachines = this.machines.filter((machine) =>
        machine.name.toLowerCase().includes(newText.toLowerCase())
      );
    },
  },
  components: {
    MachineForm,
    MachineDetailsModal,

  },
};
</script>
<style scoped lang="scss">
@import "@/assets/styles/main.scss";

</style>