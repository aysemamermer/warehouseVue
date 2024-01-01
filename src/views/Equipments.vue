<template>
  <div class="container mt-3">
    <h1>Equipments</h1>
    <div class="button-container">
      <button @click="openAddForm" class="btn btn-primary">Add Equipment</button>
      <div class="button-spacing"></div>
      <router-link to="/machines" class="btn btn-primary">Go to Machines</router-link>
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
            <th>Machine</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="equipment in filteredEquipments" :key="equipment.id">
            <td>{{ equipment.id }}</td>
            <td>{{ equipment.name }}</td>
            <td>{{ equipment.inventory_number }}</td>
            <td>{{ equipment.machine_id ? equipment.machine_id : 'N/A' }}</td>
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
      :handle-submit="handleSubmit"
      :close-form="closeForm"
      :local-error-message="localErrorMessage"
      :machine-options="machineOptions"
    ></common-form>
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
      localErrorMessage: '',
    };
  },
  mounted() {
    this.fetchEquipments();
    this.fetchMachineOptions();
  },
  computed: {
    filteredEquipments() {
      const searchTextLower = this.searchText.toLowerCase().trim();
      return this.equipments.filter(equipment => (
        (!searchTextLower || equipment.name.toLowerCase().includes(searchTextLower)) ||
        (!searchTextLower || equipment.inventory_number.toLowerCase().includes(searchTextLower))
      ));
    }
  },
  methods: {
    async fetchEquipments() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/equipment/', {
          params: {
            name: this.searchText,
            inventory_number: this.searchText,
          },
        });
        this.equipments = response.data;
      } catch (error) {
        console.error('API Error:', error);
        this.errorMessage = 'An error occurred while fetching equipment data.';
      }
    },
    openAddForm() {
    this.selectedEquipment = null;
    this.formData = {}; // Form verilerini sıfırla
    this.isFormVisible = true;
  },

    deleteEquipment(equipmentId) {
      if (confirm('Are you sure you want to delete this equipment?')) {
        axios
          .delete(`http://127.0.0.1:8000/api/equipment/${equipmentId}/delete/`)
          .then(() => {
            this.fetchEquipments();
          })
          .catch((error) => {
            console.error('API Error:', error);
          });
      }
    },
    closeForm() {
      this.isFormVisible = false;
      this.selectedEquipment = null;
      this.successMessage = '';
    },
    async addEquipment() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/equipment/', this.formData);
        this.$emit('add', response.data);
        window.location.reload();
      } catch (error) {
        this.handleApiError(error);
      }

    },

    updateEquipment() {
  axios
    .put(`http://127.0.0.1:8000/api/equipment/${this.selectedEquipment.id}/`, this.formData)
    .then((response) => {
      this.successMessage = 'Equipment updated successfully!';
      this.successModalVisible = true;
      this.$emit('close');
      this.fetchEquipments();
      this.$emit('updateEquipments'); 
    })
    .catch((error) => {
      this.handleApiError(error);
    });
},
  editEquipment(equipment) {
    this.selectedEquipment = { ...equipment };
    this.formData = { ...equipment }; // Form verilerini seçilen ekipmanın bilgileriyle doldur
    this.isFormVisible = true;
  },
    handleSubmit() {
      if (this.selectedEquipment) {
        this.updateEquipment();
      } else {
        this.addEquipment();
      }
    },

    handleApiError(error) {
      if (error.response && error.response.status === 400 && error.response.data) {
        const apiErrors = error.response.data;
        if (apiErrors.inventory_number) {
          this.localErrorMessage = apiErrors.inventory_number[0];
        } else {
          this.localErrorMessage = 'Something went wrong. Please try again.';
        }
      } else if (error.response && error.response.status === 500) {
        this.localErrorMessage = 'Server error. Please try again.';
      } else {
        this.localErrorMessage = 'Something went wrong. Please try again.';
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
  },
  components: {
    CommonForm,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
</style>
