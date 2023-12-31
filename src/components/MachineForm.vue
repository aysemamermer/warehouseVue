<template>
  <div v-if="visible">
    <div class="spacer"></div>

    <div class="container">

      <h2>{{ machine ? 'Edit Machine' : 'Add Machine' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Name:</label>
          <input v-model="formData.name" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Inventory Number:</label>
          <input v-model="formData.inventory_number" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Location:</label>
          <input v-model="formData.location" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Description:</label>
          <textarea v-model="formData.description" class="form-control"></textarea>
        </div>

        <div class="button-container">
          <button type="submit" class="btn btn-primary">{{ machine ? 'Save Changes' : 'Add Machine' }}</button>
          <div class="button-spacing"></div>
          <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
      <div class="spacer-form"></div>

      <div v-if="localErrorMessage" class="alert alert-danger mt-4">
        {{ localErrorMessage }}
      </div>

      <div v-if="successModalVisible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeSuccessModal">&times;</span>
          <p>{{ successMessage }}</p>
          <button @click="closeSuccessModal" class="btn btn-primary">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    machine: Object,
    visible: Boolean,
    errorMessage: String,
  },
  data() {
    return {
      formData: {
        name: '',
        inventory_number: '',
        location: '',
        description: '',
      },
      machineDataList: [],
      localErrorMessage: '',
      successMessage: '', // Başarı mesajı değişkeni
      successModalVisible: false, // Başarı modalını kontrol etmek için
    };
  },
  watch: {
    machine: {
      handler: 'populateFormData',
      immediate: true,
    },
    errorMessage: {
      handler: 'updateLocalErrorMessage',
      immediate: true,
    },
  },
  mounted() {
    this.fetchMachineData();
  },
  methods: {
    populateFormData(newMachine) {
      if (newMachine) {
        this.formData = { ...newMachine };
      } else {
        this.formData = {
          name: '',
          inventory_number: '',
          location: '',
          description: '',
        };
      }
    },
    handleSubmit() {
      if (this.machine) {
        this.updateMachine();
      } else {
        this.addMachine();
      }
    },
    async addMachine() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/machines/', this.formData);
        this.$emit('add', response.data);
        this.closeForm();
        this.fetchMachineData();

        // API'den gelen success_message'i kontrol et
        const successMessage = response.data.success_message;
        if (successMessage) {
          this.successMessage = successMessage;
          this.successModalVisible = true;
        } else {
          this.successMessage = 'Machine added successfully!';
          this.successModalVisible = true;
        }

      } catch (error) {
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
      }
    },

    updateMachine() {
      axios
        .put(`http://127.0.0.1:8000/api/machines/${this.machine.id}/`, this.formData)
        .then((response) => {
          this.closeForm();
          this.fetchMachineData();

          const successMessage = response.data.success_message;
          if (successMessage) {
            this.successMessage = successMessage;
            this.successModalVisible = true;
          } else {
            this.successMessage = 'Machine updated successfully!';
            this.successModalVisible = true;
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 400 && error.response.data) {
            // API'den gelen validation hatalarını işle
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
        });
    },
    closeForm() {
      this.$emit('close');
    },
    fetchMachineData() {
      axios
        .get('http://127.0.0.1:8000/api/machines/')
        .then((response) => {
          this.machineDataList = response.data;
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    },
    updateLocalErrorMessage(newErrorMessage) {
      this.localErrorMessage = newErrorMessage;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
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
