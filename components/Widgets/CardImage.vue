<template>
  <div class="row">
    <!-- Asegúrate de que los elementos estén dentro de una fila -->
    <div class="col-6">
      <!-- Esto aplica el ancho de la columna -->
      <b-img
        :src="`/img/${config.selectedImage}`"
        fluid
        alt="Responsive image"
      ></b-img>
      <h1>{{ config }}</h1>
    </div>
  </div>
</template>


<script>
export default {
  name: "CardImage",
  props: ["config"],
  data() {
    return {};
  },
};
</script>
