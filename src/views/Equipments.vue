<template>
  <div class="container mt-3">
    <div>
      <h1>Equipments</h1>
      <button @click="openAddForm" class="btn btn-primary">Add Equipment</button>
      <div class="spacer"></div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Inventory Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="equipment in equipments" :key="equipment.id">
              <td>{{ equipment.id }}</td>
              <td>{{ equipment.name }}</td>
              <td>{{ equipment.inventory_number }}</td>
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
    <!-- Başarı Mesajı -->
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
    };
  },
  mounted() {
    this.fetchEquipments();
  },
  methods: {
    fetchEquipments() {
    axios
      .get('http://127.0.0.1:8000/api/equipment/')
      .then((response) => {
        this.equipments = response.data;
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
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
          .delete(`http://127.0.0.1:8000/api/equipment/${equipmentId}/`)
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
      this.successMessage = ''; // Başarı mesajını sıfırla
    },
    addEquipment() {
      this.successMessage = 'Equipment added successfully!';
      this.fetchEquipments();
    },
    updateEquipment() {
    this.successMessage = 'Equipment updated successfully!';
    this.fetchEquipments();
    this.successModalVisible = true;
  },


  },
  components: {
    EquipmentForm,
  },
};
</script>

<style scoped>

.table-container {
  max-height: 300px; 
  overflow-y: auto;
  border: 1px solid #ddd; 
  border-radius: 5px; 
  overflow: auto; 
  padding: 10px; 

}
.spacer-containers {
  margin-top: 40px; 
}
.spacer {
  margin-top: 20px; 
}

.button-container {
  display: flex;
  align-items: center;
}

.button-spacing {
  margin-right: 10px; 
}

</style>
