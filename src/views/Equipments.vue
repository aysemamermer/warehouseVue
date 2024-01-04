<template>
  <div class="container mt-3">
    <h1>Equipments</h1>

    <div class="button-container">
      <router-link to="/" class="btn btn-primary">Home</router-link>
      <div class="button-spacing"></div>
      <router-link to="/machines" class="btn btn-primary">Machines</router-link>

    </div>
    <div class="spacer"></div>
    <div class="button-container">
      <button @click="openAddForm" class="btn btn-primary custom-btn-green">Add Equipment</button>
      <div class="button-spacing"></div>
    </div>
    <div class="spacer"></div>
    <div class="mb-3">
      <label class="form-label">Search:</label>
      <input v-model="searchText" @input="handleSearch" class="form-control" placeholder="Search by name or inventory number">
    </div>
    <div class="spacer"></div>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Inventory Number</th>
            <th>MachineID</th>
            <th>Machine Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipment in equipments" :key="equipment.id">
            <td>{{ equipment.id }}</td>
            <td>{{ equipment.name }}</td>
            <td>{{ equipment.inventory_number }}</td>
            <td>{{ equipment.machine_id ? equipment.machine_id : 'N/A' }}</td>
            <td>{{ getMachineName(equipment.machine_id) }}</td>
            <td>
              <div class="button-container">
                <button @click="editEquipment(equipment)" class="btn btn-warning">Edit</button>
                <div class="button-spacing"></div>
                <button @click="deleteEquipment(equipment.id)" class="btn btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="spacer-containers"></div>
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success mt-4">
      {{ successMessage }}
    </div>
    <common-form 
      :visible="isFormVisible" 
      :form-title="selectedEquipment ? 'Edit Equipment' : 'Add Equipment'"
      :form-fields="formFields" 
      :form-button-text="selectedEquipment ? 'Save Changes' : 'Add Equipment'"
      :form-data="formData" 
      :handle-submit="selectedEquipment ? updateEquipment : addEquipment"
      :close-form="closeForm" 
      :errorMessage="errorMessage"
      :machine-options="machineOptions">
    </common-form>
  </div>
</template>

<script>
import axios from 'axios';
import CommonForm from '@/components/CommonForm.vue';

export default {
  data() {
    return {

      equipments: [],
      isFormVisible: false,
      selectedEquipment: null,
      errorMessage: '',
      successMessage: '',
      searchText: '',
      formFields: [
        { id: "name", label: "Name", required: true },
        { id: "inventory_number", label: "Inventory Number", required: true },
        { id: "machine_id", label: "Makine Id", required: true },
      ],
      formData: {},
      machineOptions: [],
    };
  },
  mounted() {
    this.handleSearch()
    this.fetchMachineOptions();
  },
  computed: {

  },
  methods: {
    
    async handleSearch() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/equipment/', {
          params: {
            search: this.searchText,
          },
        });
        this.equipments = response.data;
      } catch (error) {
        console.error('API Error:', error);
        this.showErrorMessage('An error occurred while fetching equipment h data.');
      }
    },

    async deleteEquipment(equipmentId) {
      if (confirm('Are you sure you want to delete this equipment?')) {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/api/equipment/${equipmentId}/delete/`);
          this.handleSearch();
          this.showSuccessMessage("Equipment deleted!")
          this.closeForm()
        } catch (error) {
          console.error('API Error:', error);
          this.handleApiError(error);
        }
      }
    },

    async addEquipment() {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/equipment/', this.formData);
        this.handleSearch();
        this.showSuccessMessage(response.data.success_message);

        this.closeForm();
        const successMessage = response.data.message;

        if (successMessage) {
            this.successMessage = successMessage;
            this.successModalVisible = true;
        } else {
        }
    } catch (error) {
        this.handleApiError(error);
    }
},

async updateEquipment() {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/equipment/${this.selectedEquipment.id}/`, this.formData);
        if (response.data.success_message) {
            this.showSuccessMessage(response.data.success_message);
            this.handleSearch();
            this.closeForm();
        } else {
            console.error('Invalid response structure:', response);
        }
    } catch (error) {
        this.handleApiError(error)
    }
},

    handleApiError(error) {
      if (error.response && error.response.status === 400 && error.response.data) {
        const apiErrors = error.response.data;
        if (apiErrors.inventory_number) {
          this.errorMessage = apiErrors.inventory_number[0];
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
    async fetchMachineOptions() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/machines/');
        this.machineOptions = response.data;
      } catch (error) {
        console.error('API Error:', error);
      }
    },

    closeForm() {
      this.isFormVisible = false;
      this.selectedEquipment = null;
    },
    openAddForm() {
      this.selectedEquipment = null;
      this.formData = {};
      this.isFormVisible = true;
    },

    editEquipment(equipment) {
      this.selectedEquipment = { ...equipment };
      this.formData = { ...equipment };
      this.isFormVisible = true;
    },

    getMachineName(machineId) {
      const machine = this.machineOptions.find(machine => machine.id === machineId);
      return machine ? machine.name : 'N/A';
    },
    
    clearMessages() {
      setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  },

    showErrorMessage(message) {
      this.errorMessage = message;
      this.clearMessages();
    },

    showSuccessMessage(message) {
      this.successMessage = message;
      this.clearMessages();
    },
  },
  components: {
    CommonForm,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
</style>
