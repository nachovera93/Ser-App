<template>
  <div class="row">
    <!-- Contenedor de fila -->
    <div :class="[config.column]">
      <!-- Contenedor con clase col-12 -->
      <b-form-checkbox v-model="isCheckboxChecked" size="sm"></b-form-checkbox>
      <b-card
        :title="config.nombre_1"
        class="card-title"
        :img-src="`/img/${config.selectedImage}`"
        :bg-variant="getCardBackgroundVariant()"
        img-alt="Card image"
        img-left
        style="max-width: 100%"
      >
        <template slot="header">
          <h5 class="card-category" style="font-weight: bold; font-size: 2.5em">
            {{ config.NameWidget }}
          </h5>
          <h3 class="card-title" style="font-weight: bold; font-size: 1.5em">
            <i
              class="fa"
              :class="[config.icon, getIconColorClass()]"
              aria-hidden="true"
              style="font-size: 30px"
            ></i>
            <base-switch
              @click="
                value = !value;
                sendValue();
              "
              :value="value"
              type="primary"
              on-text="ON"
              off-text="OFF"
              style="margin-top: 10px"
              class="pull-right"
            >
            </base-switch>
          </h3>
        </template>
        <b-card-text class="small-text">
          <!-- Contenido de la tarjeta -->
        </b-card-text>
      </b-card>
      <h5 v-if="isCheckboxChecked" class="title-text">
        Tópico actual: {{ topic }}
      </h5>
    </div>
  </div>
</template>


<script>
export default {
  name: "iotswitch",
  props: ["config"],

  data() {
    return {
      value: true,
      isCheckboxChecked: false,
      topic: "",
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/actdata";
        }, 300);
      },
    },
  },

  mounted() {},
  beforeDestroy() {},
  methods: {
    getCardBackgroundVariant() {
      return this.value ? "danger" : ""; // 'danger' es una clase típica para rojo en muchos frameworks CSS
    },

    getIconColorClass() {
      //para apagar el icono
      if (!this.value) {
        return "text-dark";
      }

      if (this.config.class == "success") {
        return "text-success";
      }
      if (this.config.class == "primary") {
        return "text-primary";
      }
      if (this.config.class == "warning") {
        return "text-warning";
      }
      if (this.config.class == "danger") {
        return "text-danger";
      }
    },

    sendValue() {
      // Construye el tópico y actualízalo
      this.topic =
        this.config.userId +
        "/" +
        this.config.selectedDevice.dId +
        "/" +
        this.config.variable +
        "/actdata";

      const toSend = {
        topic: this.topic,
        msg: {
          value: this.value,
        },
      };
      console.log(toSend.topic);
      console.log(toSend);
      $nuxt.$emit("mqtt-sender", toSend);
    },
  },
};
</script>
<style></style>
