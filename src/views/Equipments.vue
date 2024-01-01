<template>
  <div class="container mt-3">
    <div>
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
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      {{ errorMessage }}
    </div>
    
    <div v-if="successMessage" class="alert alert-success mt-4">
      {{ successMessage }}
    </div>
    
    <equipment-form
      :equipment="selectedEquipment"
      :visible="isFormVisible"
      @add="addEquipment"
      @update="updateEquipment" 
      @close="closeForm"
      :error-message="errorMessage"
      :success-message="successMessage"
    ></equipment-form>
  </div>
</template>

<script>
import axios from 'axios';
import EquipmentForm from '@/components/EquipmentForm.vue';

export default {
  data() {
    return {
      equipments: [],
      isFormVisible: false,
      selectedEquipment: null,
      errorMessage: '',
      successMessage: '',
      searchText: '',
    };
  },  
  mounted() {
    this.fetchEquipments();
  },
  computed: {
  filteredEquipments() {
    const searchTextLower = this.searchText.toLowerCase().trim();

    return this.equipments.filter(equipment => {
      return (
        (!searchTextLower || equipment.name.toLowerCase().includes(searchTextLower)) ||
        (!searchTextLower || equipment.inventory_number.toLowerCase().includes(searchTextLower)) 
       
      );
    });
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
      this.isFormVisible = true;
    },
    editEquipment(equipment) {
      this.selectedEquipment = equipment;
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
    addEquipment() {
      this.successMessage = 'Equipment added successfully!';
      this.fetchEquipments();

    },
    updateEquipment() {
      this.successMessage = 'Equipment updated successfully!';
      this.fetchEquipments();
    },
  },
  watch: {
  searchText: {
    handler: 'fetchEquipments',
    immediate: false,
  },
},

  components: {
    EquipmentForm,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";

</style>