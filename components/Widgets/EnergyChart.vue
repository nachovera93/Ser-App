<template>
  <b-card type="chart" class="custom-card">
    <!-- <h5>{{ this.Dia }}</h5> -->
    <h5>{{ this.valorExtraido }}</h5>
    <div class="header-container d-flex justify-content-center">
      <div class="values-container">
        <div
          class="value-item d-flex align-items-center"
          v-for="(serie, index) in chartOptionsLive.series"
          :key="index"
        >
          <span
            class="value-color mr-2"
            :style="{ backgroundColor: serie.color }"
          ></span>
          <span class="value-name mr-2">{{ serie.name }}</span>
        </div>
      </div>
      <div class="chart-select-container ml-auto">
        <base-input>
          <b-form-select v-model="selected_minutes">
            <option
              v-for="(minutes, index) in minutes_options"
              :key="index"
              :value="minutes.value"
            >
              {{ minutes.label }}
            </option>
          </b-form-select>
        </base-input>
      </div>
      <div class="chart-select-container ml-auto">
        <base-input>
          <b-form-select v-model="TypeGraphicSelect">
            <option value="null">{{ TipoGrafico }}</option>
            <option
              v-for="(TipoGrafico, index) in chartTypes"
              :key="index"
              :value="TipoGrafico"
            >
              {{ TipoGrafico }}
            </option>
          </b-form-select>
        </base-input>
      </div>
    </div>

    <div class="chart-area">
      <div class="legend-container"></div>
      <div class="chart-area" style="height: 300px">
        <highchart
          :animation="{ duration: config.animacion }"
          :exporting="true"
          style="height: 100%"
          v-if="isMounted"
          :options="chartOptionsLive"
          :update="watchers"
        />
      </div>
    </div>
    <h5>{{ this.topic }}</h5>
    <h5>{{ this.config }}</h5>
  </b-card>
</template>

<script>
import { DatePicker, TimeSelect } from "element-ui";
import("highcharts/highcharts").Options;
export default {
  name: "Energychart",
  props: ["config"],
  components: {
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect,
  },
  data() {
    return {
      chartOptionsLiveData: [[]],
      colors: [
        "#007bff",
        "#17a2b8",
        "#28a745",
        "#dc3545",
        "#ffc107",
        "#000000",
        "#123456",
        "#abcdef",
      ],
      year: "Año: " + new Date().getFullYear(),
      month: "Mes: " + new Date().getFullYear() + "-" + new Date().getMonth(),
      Dia:
        "Día: " +
        new Date().getFullYear() +
        "-" +
        new Date().getMonth() +
        "-" +
        new Date().getDate(),
      visible: true,
      selected_minutes: null,
      minutes_options: [
        { value: null, label: "60 min" },
        { value: 60, label: "60 min" },
        { value: 120, label: "120 min" },
        { value: 480, label: "480 min" },
        { value: 720, label: "720 min" },
        { value: 1440, label: "1440 min" },
      ],
      seriesColor: "",
      valorExtraido: 0,
      colorInputIsSupported: null,
      chartTypes: [],
      watchers: undefined,
      timebacks: "",
      TypeGraphicSelect: this.config.tipo,
      TipoGrafico: "",
      chartOptioncolor: "",
      datetime: [],
      datetime_real_time: [],
      receivedTime: 0,
      valueVariable: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: "",
      chartOptionsLiveData: [],
    };
  },
  watch: {
    selected_minutes(select) {
      console.log("select: ", select);
      this.timeago = select;
      (this.config.chartTimeAgo = select), this.getChartData();
    },
    seriesColor(newVal2) {
      this.seriesColor = newVal2;
      this.updateColorClass(newVal2);
    },
    TypeGraphicSelect(newVal3) {
      this.TipoGrafico = newVal3;
      this.updateTipo(newVal3);
    },
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.valueVariable = 0;
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
          this.chartOptionsLiveData = [];
          this.chartOptionsLive.xAxis.categories = [];
          this.getChartData();
          if (
            this.chartOptionsLive.series &&
            this.chartOptionsLive.series.length > 0
          ) {
            this.chartOptionsLive.series[0].name =
              this.config.NameWidget + " " + this.config.unit;
          }
          window.dispatchEvent(new Event("resize"));
        }, 300);
      },
    },
  },
  computed: {
    chartOptionsLive() {
      return {
        credits: {
          enabled: false,
        },
        chart: {
          backgroundColor: "rgba(0,0,0,0)",
          className: "my-chart",
          type: this.TipoGrafico,
        },
        yAxis: {
          title: {
            text: this.config.unit_1,
          },
          labels: {
            style: {
              color: "#ffffff",
              font: "11px Trebuchet MS, Verdana, sans-serif",
            },
          },
        },
        title: {
          text: "",
        },
        legend: {
          enabled: false,
          itemStyle: {
            color: "#ffffff",
          },
        },
        series: this.chartOptionsLiveData.map((dataSeries, index) => {
          const variableName = "nombre_" + (index + 1);
          const variable = this.config[variableName];
          const color = this.colors[index % this.colors.length]; // Usa el operador módulo para evitar errores de índice
          return {
            name: variable ? variable : "",
            data: dataSeries,
            color: color,
          };
        }),

        xAxis: {
          categories: this.datetime_real_time,
          //type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2",
            },
          },
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      };
    },
  },
  mounted() {
    //this.GetColorClass();
    const i = document.createElement("input");
    i.setAttribute("type", "color");
    this.colorInputIsSupported = i.type === "color";
    this.TypeGraphicSelect = null;
    this.chartTypes = this.$highcharts.chartTypes;
    console.log("charttypes ", this.$highcharts.chartTypes);
    //this.chartType = this.chartTypes[0];
    //this.seriesColor = this.colorInputIsSupported ? this.DBcolor : this.colors[0];
    //this.seriesColor = this.colorInputIsSupported ? "#6020cd" : this.colors[0];
    this.GetTipo();
    console.log("Config: ", this.config);
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    async getChartData() {
      try {
        const axiosHeaders = {
          headers: {
            token: $nuxt.$store.state.auth.token,
          },
          params: {
            dId: this.config.selectedDevice.dId,
            variable: this.config.variable,
            NameWidget: this.config.NameWidget,
            chartTimeAgo: this.config.chartTimeAgo,
          },
        };
        const res = await this.$axios.get(
          "/get-small-charts-data",
          axiosHeaders
        );
        if (res.data.status == "success") {
          // Limpiar el array que almacenará las series de datos.
          this.chartOptionsLiveData = [];
          this.datetime_real_time = [];
          console.log("a Graficar");
          console.log(res.data);
          // Crear un objeto para almacenar los datos de cada serie.
          const seriesData = {};
          res.data.data.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          const nameWidgets = this.config.NameWidget.split(",");
          nameWidgets.forEach((item) => {
            seriesData[item] = [];
          });
          // Llenar el objeto de series de datos.
          res.data.data.forEach((element) => {
            const date = new Date(element.timestamp).toLocaleString("es-CL", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            });
            this.datetime_real_time.push(date);

            nameWidgets.forEach((nameWidget) => {
              if (element[nameWidget] !== undefined) {
                seriesData[nameWidget].push(element[nameWidget]);
              }
            });
          });
          this.datetime_real_time = [...new Set(this.datetime_real_time)];
          console.log("this.datetime_real_time: ", this.datetime_real_time);
          // Convertir el objeto de series de datos en un array.
          for (let key in seriesData) {
            this.chartOptionsLiveData.push(seriesData[key]);
          }
          this.isMounted = true;
        }
      } catch (error) {
        console.log(error);
        this.errorMessage =
          "Error al obtener datos del dispositivo seleccionado";
        return;
      }
    },

    procesReceivedData(data) {
      console.log("ProcessReceived: ", data);
      this.valorExtraido = data.value[0];
      console.log(this.valorExtraido); // Esto imprimirá 22

      try {
        setTimeout(() => {
          //if (data.save == 1) {
          this.getChartData();
          console.log("Hola");
          //}
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },

    async GetColorClass() {
      console.log("Entro GetColorClass");
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token,
        },
        params: {
          nameTemplate: this.config.selectedDevice.name,
          variable: this.config.variable,
        },
      };

      try {
        const res = await this.$axios.get("/get-color", axiosHeaders);
        //console.log(res.data);
        const c = res.data.color;
        this.seriesColor = c;
        console.log("color from db: ", c);
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting color...",
        });
        console.log(error);
        return;
      }
    },
    async updateColorClass(newVal2) {
      console.log("update color" + newVal2);
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      const toSend = {
        dId: this.config.selectedDevice.dId,
        variable: this.config.variable,
        nameTemplate: this.config.selectedDevice.name,
        color: newVal2,
      };

      try {
        const res = await this.$axios.post("/post-color", toSend, axiosHeaders);

        if (res.data.status == "success") {
          console.log("Color updated");
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error Updating Color...",
        });
        console.log(error);
        return;
      }
    },
    async GetTipo() {
      console.log("GETTIPO");
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token,
        },
        params: {
          idChart: this.config.idChart,
        },
      };
      try {
        const res = await this.$axios.get("/get-tipo", axiosHeaders);
        console.log("data: ", res.data);
        const types = res.data.data.tipo.toLowerCase();
        console.log("types: ", types);
        this.TipoGrafico = types;
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting Type...",
        });
        console.log(error);
        return;
      }
    },
    async updateTipo(value3) {
      console.log("update graph " + value3);
      this.TipoGrafico = value3.toLowerCase();
      console.log(this.TipoGrafico);
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      const toSend = {
        idChart: this.config.idChart,
        tipo: value3.toLowerCase(),
      };

      try {
        const res = await this.$axios.post(
          "/update-tipo",
          toSend,
          axiosHeaders
        );
        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Graph updated!",
          });
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error Updating Graph...",
        });
        console.log(error);
        return;
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-container {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.values-container {
  font-size: 16px;
  font-weight: bold;
  flex: 1 1 auto;
}

.value-item {
  margin-bottom: 0.25rem;
}

.value-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.chart-select-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 0 0 auto;
}

.select-container {
  margin-right: 0.5rem;
}

.select-container:last-child {
  margin-right: 0;
}
</style>
