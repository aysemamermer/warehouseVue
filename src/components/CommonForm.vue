<template>
  <div v-if="visible">
    <div class="spacer"></div>
    <div class="container">
      <h2>{{ formTitle }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="field in formFields" :key="field.id" class="form-group">
          <label :for="field.id">{{ field.label }}</label>
          <template v-if="field.id === 'machine_id' && machineOptions">
            <select v-model="formData.machine_id" class="form-control">
        <option v-for="machine in machineOptions" :key="machine.id" :value="machine.id">{{ machine.name }}</option>
      </select>
          </template>
          <template v-else>
            <input v-model="formData[field.id]" :id="field.id" class="form-control" :required="field.required">
          </template>
        </div>
        <div class="button-container">
          <button type="submit" class="btn btn-primary">{{ formButtonText }}</button>
          <div class="button-spacing"></div>
          <button type="button" @click="closeForm" class="btn btn-secondary">Cancel</button>
        </div>
        <div class="spacer-form"></div>
      </form>
      <div v-if="localErrorMessage" class="alert alert-danger mt-4">
        {{ localErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    formTitle: String,
    formFields: Array,
    formButtonText: String,
    formData: Object,
    handleSubmit: Function,
    closeForm: Function,
    localErrorMessage: String,
    machineOptions: Array, 
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
</style>
