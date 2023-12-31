<template>
  <div v-if="visible">
    <div class="spacer"></div>
    <div class="container">
      <h2>{{ equipment.id ? 'Edit Equipment' : 'Add Equipment' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Name:</label>
          <input v-model="equipment.name" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Inventory Number:</label>
          <input v-model="equipment.inventory_number" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Machine:</label>
          <select v-model="equipment.machine.id" class="form-control">
            <option v-for="machineOption in machineOptions" :key="machineOption.id" :value="machineOption.id">
              {{ machineOption.name }}
            </option>
          </select>
        </div>
        <div class="button-container">
          <button type="submit" class="btn btn-primary">{{ equipment.id ? 'Save Changes' : 'Add Equipment' }}</button>
          <div class="button-spacing"></div>
          <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
      <div class="spacer-form"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props:{
    equipment : Object,
    visible: Boolean,
    errorMessage : String
  },
  data() {
    return {
      equipment: {
        id: null,
        name: '',
        inventory_number: '',
        machine: { id: null, name: '' },
      },
      machineOptions: [],
    };
  },
  watch: {
    equipment: {
      handler: 'populateFormData',
      immediate: true,
    },
    errorMessage: {
      handler: 'updateLocalErrorMessage',
      immediate: true,
    },
  },
  mounted() {
    this.fetchMachineOptions();
  },
  methods: {
    fetchMachineOptions() {
      axios
        .get('http://127.0.0.1:8000/api/machines/')
        .then((response) => {
          this.machineOptions = response.data;

          // Eğer equipment bir makineye sahipse, bu makineyi equipment içine ekleyin
          if (this.equipment.machine && this.equipment.machine.id) {
            const selectedMachine = this.machineOptions.find((machine) => machine.id === this.equipment.machine.id);
            if (selectedMachine) {
              this.equipment.machine = selectedMachine;
            }
          }
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    },
    handleSubmit() {
      if (this.equipment) {
        this.updateEquipment();
      } else {
        this.saveEquipment();
      }
    },
    saveEquipment() {
  const requestData = {
    name: this.equipment.name,
    inventory_number: this.equipment.inventory_number,
  };

  // Eğer bir makine seçilmişse ve makine nesnesi varsa
  if (this.equipment.machine && this.equipment.machine.id) {
    requestData.machine = this.equipment.machine.id;
  }

  if (this.equipment.id) {
    // Update existing equipment
    axios
      .put(`http://127.0.0.1:8000/api/equipment/${this.equipment.id}/`, requestData)
      .then((response) => {
        console.log('Equipment successfully updated:', response.data);
        this.fetchEquipments();
        this.closeForm();
      })
      .catch((error) => {
        console.error('PUT API Error:', error);
      });
  } else {
    // Add new equipment
    axios
      .post('http://127.0.0.1:8000/api/equipment/', requestData)
      .then((response) => {
        console.log('Equipment successfully added:', response.data);
        this.fetchEquipments();
        this.closeForm();
      })
      .catch((error) => {
        console.error('POST API Error:', error);
      });
  }
},
updateEquipment() {
  const requestData = {
    name: this.equipment.name,
    inventory_number: this.equipment.inventory_number,
  };

  if (this.equipment.machine && this.equipment.machine.id) {
    requestData.machine = this.equipment.machine.id;
  }

  axios
    .put(`http://127.0.0.1:8000/api/equipment/${this.equipment.id}/`, requestData)
    .then((response) => {
      this.closeForm();
      this.fetchEquipments();

      const successMessage = response.data.success_message || 'Equipment updated successfully!';
      this.successMessage = successMessage;
      this.successModalVisible = true;
    })
    .catch((error) => {
      if (error.response && error.response.status === 400 && error.response.data) {
        const apiErrors = error.response.data;
        this.localErrorMessage = apiErrors.inventory_number ? apiErrors.inventory_number[0] : 'Something went wrong. Please try again.';
      } else if (error.response && error.response.status === 500) {
        this.localErrorMessage = 'Server error. Please try again.';
      } else {
        this.localErrorMessage = 'Something went wrong. Please try again.';
      }
      console.error('API Error:', error);
    });
},

    closeForm() {
      this.$emit('close'); // Notify the parent component to close the form
    },
    openEditForm() {
  console.log('Edit button clicked. Equipment:', this.equipment);
  this.$emit('update', this.equipment); // Değişiklik burada
},
editEquipment(equipment) {
      this.selectedEquipment = equipment;
      this.isFormVisible = true;
    },

  },
};
</script>
<style scoped>
.spacer {
  margin-top: 20px;
  /* veya istediğiniz bir boşluk değeri */
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.spacer-form {
  margin-top: 50px;
  /* veya istediğiniz bir boşluk değeri */
}

.button-container {
  display: flex;
  align-items: center;
}

.button-spacing {
  margin-right: 10px;
  /* İhtiyacınıza göre ayarlayabilirsiniz */
}
</style>