<template>
  <div class="row">
    <!-- Asegúrate de tener un contenedor de fila -->
    <div :class="[config.column]">
      <!-- Contenedor con clase col-12 -->
      <card>
        <div slot="header">
          <h4 class="card-title">
            {{ config.selectedDevice.name }} - {{ config.NameWidget }}
          </h4>
        </div>

        <h5>{{ config }}</h5>
        <i
          :class="[config.icon, getIconColorClass()]"
          style="font-size: 40px"
        ></i>

        <p v-if="value !== null && value !== false" class="status">
          Bomba encendida
        </p>
        <p v-else class="status">Bomba apagada</p>
      </card>
    </div>
  </div>
</template>


<script>
export default {
  props: ["config"], // parametro que recibira algo llamado config, en este caso un objeto
  data() {
    //en data las variables del widget
    return {
      value: null,
      topic: "",
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.value = false;

          this.$nuxt.$off(this.topic);
          //Message from topic 6141e806a12fd20015e25c68/123454321/2EBl7kjdW3/sdata
          // -----------------> userId/dId/uniquestr/sdata
          const topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/sdata";
          this.$nuxt.$on(topic, this.processReceivedData);
        }, 300);
      },
    },
  },
  mounted() {
    // this.$nuxt.on es un listener que se puede suscribir a un topico interno de nuxt
    const topic =
      this.config.userId +
      "/" +
      this.config.selectedDevice.dId +
      "/" +
      this.config.variable +
      "/sdata";
    this.$nuxt.$on(topic, this.processReceivedData);
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic);
  },
  methods: {
    processReceivedData(data) {
      try {
        console.log("received");
        console.log(data);
        this.value = data.value;
        updateStatus(value);
      } catch (error) {
        console.log(error);
      }
    },

    getIconColorClass() {
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
    async updateStatus(value) {
      console.log("update State" + value);
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      const toSend = {
        dId: this.config.selectedDevice.dId,
        variable: this.config.variable,
        nameTemplate: this.config.selectedDevice.name,
        status: value,
      };

      try {
        const res = await this.$axios.post(
          "/post-status-indicator",
          toSend,
          axiosHeaders
        );

        if (res.data.status == "success") {
          console.log("Status updated");
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error Updating Status...",
        });
        console.log(error);
        return;
      }
    },
  },
};
</script>

<style>
.status {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: green;
}
</style>
