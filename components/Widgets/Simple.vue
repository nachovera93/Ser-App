<template>
  <div>
    <b-form-checkbox v-model="isCheckboxChecked" size="sm"> </b-form-checkbox>
    <b-card
      :title="config.nombre_1"
      class="card-title"
      :img-src="`/img/${config.selectedImage}`"
      :bg-variant="config.class"
      img-alt="Card image"
      img-left
    >
      <b-card-text class="small-text">
        <p
          v-for="(value, index) in values"
          :key="index"
          v-b-tooltip.hover="lastUpdatedTooltipText"
          class="value-text"
        >
          <i
            v-if="value > previousValues[index]"
            class="fas fa-arrow-up"
            style="color: green"
          ></i>
          <i
            v-else-if="value < previousValues[index]"
            class="fas fa-arrow-down"
            style="color: red"
          ></i>
          <i v-else class="fas fa-circle" style="color: yellow"></i>
          {{ Number(value).toFixed(config.decimalPlaces) }}
          {{ config.unit_1 }}
        </p>
      </b-card-text>
    </b-card>
    <h5 v-if="isCheckboxChecked" class="title-text">
      <!-- Clase CSS para título -->
      Tópico actual: {{ topic + "/sdata" }}
    </h5>
    <!-- {{ config }} -->
  </div>
</template>





<script>
import moment from "moment";
export default {
  name: "simple",
  props: ["config"],
  data() {
    return {
      isCheckboxChecked: false,
      receivedTime: 0,
      variables: [],
      time: Date.now(),
      nowTime: Date.now(),
      topic: "",
      lastUpdated: null, // Añade esta línea
      values: Array(this.config.cantidad).fill(0),
      previousValues: Array(this.config.cantidad).fill(0),
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          //this.value = 0;
          console.log("LLEGO!!");
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable;
          //"/" +
          //this.config.NameWidget;
          this.$nuxt.$on(this.topic + "/sdata", this.processReceivedData);
          //this.getData();
        }, 300);
      },
    },
  },

  mounted() {
    for (let i = 1; i <= this.config.cantidad; i++) {
      this.variables.push({
        name: this.config["nombre_" + i],
        value: null,
        previousValue: null,
      });
    }
    console.log("Variables Simple: ", this.variables);
    this.getNow();
    this.getData();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  computed: {
    lastUpdatedTooltipText() {
      return `Última actualización: ${this.lastUpdated}`;
    },
  },

  methods: {
    processReceivedData(data) {
      try {
        console.log("processReceivedData");
        console.log(data);
        if (data && data.value) {
          // Revisa si data.value existe
          this.previousValues = [...this.values];

          const newValues = data.value.slice(0, this.config.cantidad); // Corta el array data.value a la cantidad deseada
          this.values = newValues;
        } else {
          this.values = [];
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getData() {
      try {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token,
          },
          params: {
            dId: this.config.selectedDevice.dId,
            variable: this.config.variable,
            NameWidget: this.config.NameWidget,
          },
        };
        const res = await this.$axios.get("/get-last-data", axiosHeaders);
        const data = res.data.data;
        console.log("Simple getData");
        console.log(data);
        if (data && data.length > 0) {
          // Extraer los valores y asignarlos a `this.values`
          this.values = data.map((item) => item.value);
          this.lastUpdated = moment(data[0].timestamp).format(
            "DD-MM-YYYY HH:mm"
          );
        } else {
          console.log("data[0].value no está definido");
        }
      } catch (e) {
        console.log(e);
      }
    },
    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },
  },
};
</script>


<style scoped>
.card {
  /* define las dimensiones de la tarjeta */
  width: 230px;
  height: 105px;
}

.small-text {
  font-size: 10px;
  margin-top: 0;
}

.card-title {
  font-size: 15px;
  margin-top: 0;
  font-weight: bold;
}

.title-text {
  font-size: larger;
  font-weight: bold;
}

.value-text {
  font-weight: bold;
}
</style>
