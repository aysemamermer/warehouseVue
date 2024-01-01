<template>
  <CommonForm
    :visible="visible"
    :formTitle="machine ? 'Edit Machine' : 'Add Machine'"
    :formFields="machineFormFields"
    :formButtonText="machine ? 'Save Changes' : 'Add Machine'"
    :formData="formData"
    :handleSubmit="handleSubmit"
    :closeForm="closeForm"
    :localErrorMessage="localErrorMessage"
  />
</template>

<script>

import axios from 'axios';
import CommonForm from "@/components/CommonForm.vue";


export default {
  components: {
    CommonForm,
  },
  props: {
    machine: Object,
    visible: Boolean,
    errorMessage: String,
  },
  data() {
    return {
      machineFormFields: [
        { id: "name", label: "Name", required: true },
        { id: "inventory_number", label: "Inventory Number", required: true },
        { id: "location", label: "Location", required: true },
        { id: "description", label: "Description", required: false },
      ],
      machineDataList: [],
      localErrorMessage: '',
      successMessage: '', 
      successModalVisible: false,
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

<style scoped lang="scss">
@import "@/assets/styles/main.scss";

</style>