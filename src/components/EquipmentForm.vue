<template>
  <div v-if="visible">
    <div class="spacer"></div>
    <div class="container">
      <h2>{{ equipment.id ? 'Edit Equipment' : 'Add Equipment' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name:</label>
          <input v-model="formData.name" id="name" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="inventory_number">Inventory Number:</label>
          <input v-model="formData.inventory_number" id="inventory_number" class="form-control" required>
        </div>
        <div class="form-group">
          <label for="machine">Machine:</label>
          <select v-model="formData.machine" id="machine" class="form-control">
            <option v-for="machineOption in machineOptions" :key="machineOption.id" :value="machineOption">
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
      <div v-if="localErrorMessage" class="alert alert-danger mt-4">
        {{ localErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    equipment: Object,
    visible: Boolean,
    errorMessage: String,
  },
  data() {
    return {
      formData: {
        name: '',
        inventory_number: '',
        machine: null,
      },
      machineOptions: [],
      localErrorMessage: '',
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
    populateFormData(newEquipment) {
      if (newEquipment) {
        this.formData = { ...newEquipment };
      } else {
        this.formData = {
          name: '',
          inventory_number: '',
          machine: null,
        };
      }
    },
    handleSubmit() {
      if (this.equipment.id) {
        this.updateEquipment();
      } else {
        this.addEquipment();
      }
    },
    async addEquipment() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/equipment/', this.formData);
        this.$emit('add', response.data);
        this.closeForm();
      } catch (error) {
        this.handleApiError(error);
      }
    },
    updateEquipment() {
      axios
        .put(`http://127.0.0.1:8000/api/equipment/${this.equipment.id}/`, this.formData)
        .then((response) => {
          this.closeForm();
        })
        .catch((error) => {
          this.handleApiError(error);
        });
    },
    closeForm() {
      this.$emit('close');
      this.formData = {
        name: '',
        inventory_number: '',
        machine: null,
      };
    },
    fetchMachineOptions() {
      axios
        .get('http://127.0.0.1:8000/api/machines/')  // Assuming there is an endpoint for fetching machines
        .then((response) => {
          this.machineOptions = response.data;
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    },
    updateLocalErrorMessage(newErrorMessage) {
      this.localErrorMessage = newErrorMessage;
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
  },
};
</script>

<style scoped>
.spacer {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  align-items: center;
}

.button-spacing {
  margin-right: 10px;
}
</style>
