<template>
  <div class="container mt-3">
    <div>
      <h1>Machines</h1>
      <div class="button-container">
        <router-link to="/" class="btn btn-primary">Home</router-link>
        <div class="button-spacing"></div>
        <router-link to="/equipments" class="btn btn-primary">Equipments</router-link>

      </div>
      <div class="spacer"></div>
      <div class="button-container">
        <button @click="openAddForm" class="btn btn-primary custom-btn-green">Add Machine</button>
        <div class="button-spacing"></div>

      </div>
      <div class="spacer"></div>
      <div class="mb-3">
        <label class="form-label">Search:</label>
        <input v-model="searchText" class="form-control" placeholder="Search by name, inventory number or location ">
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
          <!--<thead>
          <tr>
            <th></th>
            <th><div class="mb-3">
              <input v-model="nameFilter" class="form-control" placeholder="Search by name">
            </div></th>
            <th><div class="mb-3">
              <input v-model="inventoryNumberFilter" class="form-control" placeholder="Search by inventory number">
            </div></th>
            <th><div class="mb-3">
              <input v-model="locationFilter" class="form-control" placeholder="Search by location">
            </div></th>
            <th></th>
          </tr>
        </thead>-->
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
    <div v-if="successMessage" class="alert alert-success mt-4">
      {{ successMessage }}
    </div>
    <CommonForm :visible="isFormVisible" :formTitle="selectedMachine ? 'Edit Machine' : 'Add Machine'"
      :formFields="machineFormFields" :formButtonText="selectedMachine ? 'Save Changes' : 'Add Machine'"
      :formData="formData" :handleSubmit="selectedMachine ? updateMachine : addMachine" :closeForm="closeForm"
       />
    <div v-if="machineDetailsModalVisible">
      <machine-details-modal :is-visible="machineDetailsModalVisible" :machine-details="machineDetails"
        :connected-equipments="connectedEquipments" @close="closeMachineDetailsModal"></machine-details-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CommonForm from "@/components/CommonForm.vue";
import MachineDetailsModal from '@/components/MachineDetailsModal.vue';

export default {
  data() {
    return {
      /*nameFilter: '',
      inventoryNumberFilter: '',
      locationFilter: '',
      descriptionFilter: '',*/
      machineDetailsModalVisible: false,
      machineDetails: {},
      connectedEquipments: [],
      machines: [],
      searchText: '',
      filteredMachines: [],
      isFormVisible: false,
      selectedMachine: null,
      errorMessage: '',
      successMessage: '',
      successModalVisible: false,
      formData: {
        name: '',
        inventory_number: '',
        location: '',
        description: '',
      },
      machineFormFields: [
        { id: 'name', label: 'Name', required: true },
        { id: 'inventory_number', label: 'Inventory Number', required: true },
        { id: 'location', label: 'Location', required: true },
        { id: 'description', label: 'Description', required: false },
      ],
    };
  },
  mounted() {
    this.fetchMachines();
  },
  computed: {

/*  filteredMachines() {
      const searchTextLower = this.searchText.toLowerCase().trim();

      return this.machines.filter((machine) => {
        return (
          (!searchTextLower || machine.name.toLowerCase().includes(searchTextLower)) &&
          (!this.nameFilter || machine.name.toLowerCase().includes(this.nameFilter.toLowerCase())) &&
          (!this.inventoryNumberFilter || machine.inventory_number.toLowerCase().includes(this.inventoryNumberFilter.toLowerCase())) &&
          (!this.locationFilter || machine.location.toLowerCase().includes(this.locationFilter.toLowerCase())) &&
        );
      });
    },
  },*/

    filteredMachines() {
      const searchTextLower = this.searchText.toLowerCase().trim();

      return this.machines.filter((machine) => {
        return (
          (!searchTextLower || machine.name.toLowerCase().includes(searchTextLower)) ||
          (!searchTextLower || machine.inventory_number.toLowerCase().includes(searchTextLower)) ||
          (!searchTextLower || machine.location.toLowerCase().includes(searchTextLower))
        );
      });
    },
  },
  methods: {
    async showMachineDetails(machine) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/machines/${machine.id}/`);
        this.machineDetails = response.data;

        const equipmentResponse = await axios.get(`http://127.0.0.1:8000/api/machines/${machine.id}/equipments/`);
        this.connectedEquipments = equipmentResponse.data;

        this.machineDetailsModalVisible = true;
        this.closeForm();
      } catch (error) {
        console.error('API Error:', error);
      }
    },

    closeMachineDetailsModal() {
      this.machineDetailsModalVisible = false;
      this.machineDetails = {};
      this.connectedEquipments = [];
    },
    handleSearch() {
      this.fetchMachines();
    },
    async fetchMachines() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/machines/', {
          params: {
            search: this.searchText,
          },
        });
        this.machines = response.data;
      } catch (error) {
        console.error('API Error:', error);
        this.showErrorMessage('An error occurred while fetching machine data.')
      }
    },

    openAddForm() {
      this.errorMessage = ''
      this.selectedMachine = null;
      this.isFormVisible = true;
      this.closeMachineDetailsModal();
      this.formData = {
        name: '',
        inventory_number: '',
        location: '',
        description: '',
      };
    },
    editMachine(machine) {
      this.selectedMachine = machine;
      this.isFormVisible = true;
      this.closeMachineDetailsModal();
      this.formData = {
        name: machine.name,
        inventory_number: machine.inventory_number,
        location: machine.location,
        description: machine.description,
      };
    },
    
  async deleteMachine(machineId) {
    try {
    if (confirm('Are you sure you want to delete this machine?')) {
      await axios.delete(`http://127.0.0.1:8000/api/machines/${machineId}/delete/`);
      this.fetchMachines();
    }
    this.closeForm();
    this.closeMachineDetailsModal();
  } catch (error) {
    console.error('API Error:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      this.showErrorMessage(error.response.data.detail);
    } else {
      this.showErrorMessage('An error occurred while deleting the machine.');
    }
  }
},

    clearMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  },

  showErrorMessage(message) {
    this.errorMessage = message;
    this.clearMessages();
  },

  showSuccessMessage(message) {
    this.successMessage = message;
    this.clearMessages();
  },

    closeForm() {
      this.isFormVisible = false;
      this.selectedMachine = null;
      this.successMessage = '';
      this.localErrorMessage = '';
      this.formData = {
        name: '',
        inventory_number: '',
        location: '',
        description: '',
      };
    },
    async addMachine() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/machines/', this.formData);
        this.closeForm();
        this.fetchMachines();
        const successMessage = response.data.success_message;
        if (successMessage) {
          this.successMessage = successMessage;
          this.successModalVisible = true;
        } else {
          this.successMessage = 'Machine added successfully! ff';
          this.successModalVisible = true;
        }
        this.showSuccessMessage(successMessage)
      } catch (error) {

        this.showErrorMessage(error.response.data.detail)
        this.handleApiError(error);
      }
    },

    async updateMachine() {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/machines/${this.selectedMachine.id}/`, this.formData);

        this.closeForm();
        this.fetchMachines();
        const successMessage = response.data.success_message;
        if (successMessage) {
            this.showSuccessMessage(successMessage);
        } else {
            this.showSuccessMessage('Machine updated successfully!');
        }
    } catch (error) {
        console.error('API Error:', error);
        this.showErrorMessage(error.response.data.detail);
        this.handleApiError(error);
    }
},

      handleApiError(error) {
        if (error.response && error.response.status === 400 && error.response.data) {
          const apiErrors = error.response.data;
          if (apiErrors.inventory_number) {
            this.showErrorMessage(apiErrors.inventory_number[0])
          } else {
            this.showErrorMessage('Something went wrong. Please try again.')
          }
        } else if (error.response && error.response.status === 500) {
          this.showErrorMessage('Server error. Please try again.')
        } else {
          this.showErrorMessage('Something went wrong. Please try again.')
        }
        console.error('API Error:', error);
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
    CommonForm,
    MachineDetailsModal,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
</style>
