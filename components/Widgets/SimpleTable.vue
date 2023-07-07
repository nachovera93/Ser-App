<template>
  <div>
    <b-table
      striped
      hover
      :items="filteredItems"
      :fields="computedFields"
    ></b-table>
    <!-- <h5>{{ config }}</h5> -->
    <!-- <h5>{{ topic }}</h5> -->
    <!-- <h5 v-for="(value, index) in receivedData.value" :key="index"> -->
      <!-- {{ value }} -->
    <!-- </h5> -->
  </div>
</template>

<script>
export default {
  name: "tableBasic",
  props: ["config"],
  data() {
    return {
      topic: "",
      receivedData: [],
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/" +
            this.config.NameWidget;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);
        }, 300);
      },
    },
  },
  computed: {
    filteredItems() {
      let items = [];
      let [rows, cols] = this.config.Matriz.split(",").map(Number);
      let dataIndex = 0;
      for (let i = 1; i <= rows; i++) {
        let row = {};
        for (let j = 1; j <= cols; j++) {
          let columnName = "nombre_columna_" + j;
          if (j === 1) {
            row[this.config[columnName]] = this.config["nombre_" + i];
          } else if (j > 1) {
            row[this.config[columnName]] = this.receivedData.value
              ? this.receivedData.value[dataIndex++]
              : "";
          } else {
            row[this.config[columnName]] = "";
          }
        }
        items.push(row);
      }
      return items;
    },
    computedFields() {
      let fields = [];
      let cols = this.config.Matriz.split(",")[1];
      for (let i = 1; i <= cols; i++) {
        fields.push(this.config["nombre_columna_" + i]);
      }
      return fields;
    },
  },

  mounted() {
    console.log("Se inicia componente");
    this.getData();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },

  methods: {
    async getData() {
      try {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token,
          },
          params: {
            dId: this.config.selectedDevice.dId,
            variable: this.config.variable,
            Widget: this.config.NameWidget,
          },
        };
        console.log("Enviando: ", axiosHeaders);
        const res = await this.$axios.get("/get-last-data", axiosHeaders);

        let obj = { value: [], save: 1 };
        res.data.data.forEach((item, index) => {
          obj.value.push(item.value);
          if (index === 0) {
            obj.currentType = item.name;
          } else {
            obj.currentType += "," + item.name;
          }
        });

        this.receivedData = obj;
        console.log("this.receivedData");
        console.log(this.receivedData);
      } catch (e) {
        console.log(e);
      }
    },

    procesReceivedData(data) {
      console.log("Llego topico en table");
      console.log(data);
      this.receivedData = data;
    },
  },
};
</script>


