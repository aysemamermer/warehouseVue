<template>
  <div class="container mt-3">
    <div class="home">
      <h1>Warehouse Application</h1>
      <div class="button-container">
        <router-link to="/machines">
          <button class="btn btn-primary">Go to Machines</button>
        </router-link>
        <div class="button-spacing"></div>
        <router-link to="/equipments">
          <button class="btn btn-primary">Go to Equipments</button>
        </router-link>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "Home",
};
</script>
  

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
</style>
  
  