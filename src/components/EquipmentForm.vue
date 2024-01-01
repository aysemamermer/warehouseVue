<template>
<CommonForm
        :visible="visible"
        :formTitle="equipment ? 'Edit Equipment' : 'Add Equipment'"
        :formFields="formFields"
        :formButtonText="equipment ? 'Save Changes' : 'Add Equipment'"
        :formData="formData"
        :handleSubmit="handleSubmit"
        :closeForm="closeForm"
        :localErrorMessage="localErrorMessage"
        :machineOptions="machineOptions"
      />
</template>
<script>

import axios from 'axios';
import CommonForm from '@/components/CommonForm.vue';

export default {
  components: {
    CommonForm,
  },
  props: {
    equipment : Object,
    visible: Boolean,
    errorMessage: String,
  },
  data() {
    return {
      formFields:[
        { id: "name", label: "Name", required: true },
        { id: "inventory_number", label: "Inventory Number", required: true },
        { id: "machine_id", label: "Makine Id", required: true },
      ],

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
  if (newEquipment && newEquipment.id !== null) {
    this.formData = { ...newEquipment };
  } else {
    this.formData = {
      name: '',
      inventory_number: '',
      machine_id: null,
    };
  }
},
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
    handleSubmit() {
      if (this.equipment) {
        this.updateEquipment();
      } else {
        this.addEquipment();
      }
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
    .put(`http://127.0.0.1:8000/api/equipment/${this.equipment.id}/`, this.formData)
    .then((response) => {
      this.$emit('close');
      this.fetchEquipments();
      this.$emit('updateEquipments'); 
      window.location.reload();
    })
    .catch((error) => {
      this.handleApiError(error);
    });
},
    closeForm() {
      this.fetchEquipments();
      this.isFormVisible = false;
      this.selectedMachine = null;
      this.successMessage = '';
      this.$emit('close');
    },
    fetchMachineOptions() {
      axios
        .get('http://127.0.0.1:8000/api/machines/')
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


<style scoped lang="scss">
@import "@/assets/styles/main.scss";

</style>