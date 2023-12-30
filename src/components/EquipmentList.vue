<!-- Değişiklikler:
- 'equipment' adını 'selectedEquipment' olarak güncelledim.
-->

<template>
  <div>
    <h1>Equipments</h1>
    <ul>
      <li v-for="equipment in equipments" :key="equipment.id">
        {{ equipment.name }} - {{ equipment.inventoryNumber }}
        <button @click="editEquipment(equipment)">Edit</button>
        <button @click="deleteEquipment(equipment.id)">Delete</button>
      </li>
    </ul>

    <!-- Equipment editing form modal -->
    <equipment-form
      :equipment="selectedEquipment"
      :visible="isEditFormVisible"
      @close="closeEditForm"
      @update="fetchEquipments"
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
      isEditFormVisible: false,
      selectedEquipment: null,
    };
  },
  mounted() {
    this.fetchEquipments();
  },
  methods: {
    fetchEquipments() {
      axios.get('http://127.0.0.1:8000/api/equipment/')
        .then(response => {
          this.equipments = response.data;
        })
        .catch(error => {
          console.error('API Error:', error);
        });
    },
    editEquipment(equipment) {
      this.selectedEquipment = equipment;
      this.isEditFormVisible = true;
    },
    deleteEquipment(equipmentId) {
      if (confirm('Are you sure you want to delete this equipment?')) {
        axios.delete(`http://127.0.0.1:8000/api/equipment/${equipmentId}/delete`)
          .then(response => {
            this.fetchEquipments();
          })
          .catch(error => {
            console.error('API Error:', error);
          });
      }
    },
    closeEditForm() {
      this.isEditFormVisible = false;
      this.selectedEquipment = null;
    },
  },
  components: {
    EquipmentForm,
  },
};
</script>
