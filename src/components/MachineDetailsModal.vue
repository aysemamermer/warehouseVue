<template>
  <div v-if="machineDetails">
    <button @click="closeMachineDetailsModal" class="btn btn-secondary mt-3">Close</button>
    <table class="table table-bordered table-striped">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Property</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, property) in machineDetails.machine_details" :key="property">
          <td>{{ property }}</td>
          <td>{{ value }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Bağlı ekipmanlar tablosu -->
    <table v-if="connectedEquipments.length > 0" class="table table-bordered table-striped inner-table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">Equipment Name</th>
          <th scope="col">Inventory Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipment in connectedEquipments" :key="equipment.id">
          <td>{{ equipment.name }}</td>
          <td>{{ equipment.inventory_number }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Bağlı ekipman yoksa bildirim -->
    <p v-else class="alert alert-info">No connected equipments.</p>

    <!-- Close butonu -->
  </div>
</template>

<script>
export default {
  props: {
    machineDetails: Object,
    connectedEquipments: Array,
  },
  methods: {
    isObject(value) {
      return typeof value === "object" && !Array.isArray(value);
    },
    closeMachineDetailsModal() {
      // Ana bileşene close olayını iletiyoruz
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.inner-table {
  width: 100%;
  margin-top: 10px;
}

/* Close butonu için stil ekleyebilirsiniz */
.btn-secondary {
  margin-bottom: 10px;
}
</style>
