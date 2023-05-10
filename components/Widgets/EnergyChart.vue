<template>
  <b-card type="chart" class="custom-card">
    <!-- <h5>{{ this.Dia }}</h5> -->
    <div class="header-container d-flex justify-content-center">
      <div class="icon-container mr-3">
        <i
          class="fa"
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
      </div>
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
              >{{ minutes.label }}</option
            >
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
              >{{ TipoGrafico }}</option
            >
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
    [TimeSelect.name]: TimeSelect
  },
  data() {
    return {
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
        { value: 1440, label: "1440 min" }
      ],
      seriesColor: "",
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
      valueVariable2: 0,
      valueVariable3: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: "",
      topic2: "",
      topic3: "",
      chartOptionsLiveData: [],
      chartOptionsLiveData2: [],
      chartOptionsLiveData3: []
    };
  },
  watch: {
    selected_minutes(select) {
      console.log("select: ", select);
      this.timeago = select;
      this.getChartData();
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
          this.valueVariable2 = 0;
          this.valueVariable3 = 0;
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/" +
            this.config.variableFullName;
          this.topic2 =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/" +
            this.config.variableFullName2;
          this.topic3 =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/" +
            this.config.variableFullName3;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);
          this.$nuxt.$on(this.topic2 + "/sdata", this.procesReceivedData);
          this.$nuxt.$on(this.topic3 + "/sdata", this.procesReceivedData);
          this.chartOptionsLiveData = [];
          this.chartOptionsLiveData2 = [];
          this.chartOptionsLiveData3 = [];
          //this.chartOptionsLive.series[0].data = [];
          this.chartOptionsLive.xAxis.categories = [];
          this.getChartData();
          this.chartOptionsLive.series[0].name =
            this.config.variableFullName + " " + this.config.unit;
          window.dispatchEvent(new Event("resize"));
        }, 300);
      }
    }
  },
  computed: {
    chartOptionsLive() {
      return {
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor: "rgba(0,0,0,0)",
          className: "my-chart",
          type: this.TipoGrafico
        },
        yAxis: {
          title: {
            text: ""
          },
          labels: {
            style: {
              color: "#d4d2d2",
              font: "11px Trebuchet MS, Verdana, sans-serif"
            }
          }
        },
        title: {
          text: ""
        },
        legend: {
          enabled: false
          //itemStyle: {
          //  color: "#d4d2d2"
          //}
        },
        series: [
          {
            name:
              this.config.nombre +
              " " +
              Number(this.valueVariable).toFixed(this.config.decimalPlaces) +
              " " +
              this.config.unit,
            data: this.chartOptionsLiveData,
            color: "#e14eca"
          },
          {
            name:
              this.config.nombre2 +
              " " +
              Number(this.valueVariable2).toFixed(this.config.decimalPlaces) +
              " " +
              this.config.unit2,
            data: this.chartOptionsLiveData2,
            color: "#00f2c3"
          },
          {
            name:
              this.config.nombre3 +
              " " +
              Number(this.valueVariable3).toFixed(this.config.decimalPlaces) +
              " " +
              this.config.unit3,
            data: this.chartOptionsLiveData3,
            color: "#1a1fa8"
          }
        ],
        xAxis: {
          categories: this.datetime_real_time,
          //type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      };
    }
  },
  mounted() {
    this.getNow();
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
    this.getLastData();
    console.log("Config: ", this.config);
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    async GetColorClass() {
      console.log("Entro GetColorClass");
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          nameTemplate: this.config.selectedDevice.name,
          variable: this.config.variable
        }
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
          message: "Error getting color..."
        });
        console.log(error);
        return;
      }
    },
    async updateColorClass(newVal2) {
      console.log("update color" + newVal2);
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
        dId: this.config.selectedDevice.dId,
        variable: this.config.variable,
        nameTemplate: this.config.selectedDevice.name,
        color: newVal2
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
          message: "Error Updating Color..."
        });
        console.log(error);
        return;
      }
    },
    async GetTipo() {
      console.log("GETTIPO");
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          idChart: this.config.idChart
        }
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
          message: "Error getting Type..."
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
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
        idChart: this.config.idChart,
        tipo: value3.toLowerCase()
      };

      try {
        const res = await this.$axios.post("/update-tipo", toSend, axiosHeaders);
        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Graph updated!"
          });
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error Updating Graph..."
        });
        console.log(error);
        return;
      }
    },
    getLastData() {
      console.log("Entro getLastData");
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          variable2: this.config.variable2,
          variable3: this.config.variable3,
          variableFullName: this.config.variableFullName,
          variableFullName2: this.config.variableFullName2,
          variableFullName3: this.config.variableFullName3,
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      //console.log("TOKEN");
      //console.log($nuxt.$store.state.auth.token);
      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then(res => {
          //console.log(res.data);
          const dataArrays = res.data.data;
          //console.log("Data1: ", dataArrays);

          const valueVariables = [
            "valueVariable",
            "valueVariable2",
            "valueVariable3"
          ];

          if (dataArrays.length === valueVariables.length) {
            for (let i = 0; i < dataArrays.length; i++) {
              this[valueVariables[i]] = dataArrays[i];
            }
          } else {
            console.error(
              "dataArrays and valueVariables should have the same length"
            );
          }

          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    async getChartData() {
      //console.log("Entro getChartData");
      //Probar con mqtt del broker de prueba
      //console.log("Data valueLocal: ", valueLocal + " / " + value2Local);
      if (this.config.demo) {
        this.chartOptionsLive.series[0].data = [
          [1606659071668, 22],
          [1606659072668, 27],
          [1606659073668, 32],
          [1606659074668, 7]
        ];
        this.isMounted = true;
        return;
      }
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          variable2: this.config.variable2,
          variable3: this.config.variable3,
          variableFullName: this.config.variableFullName,
          variableFullName2: this.config.variableFullName2,
          variableFullName3: this.config.variableFullName3,
          chartTimeAgo: this.timeago
        }
      };
      try {
        const res = await this.$axios.get(
          "/get-small-charts-data",
          axiosHeaders
        );
        if (res.data.status == "success") {
          this.chartOptionsLiveData = [];
          this.chartOptionsLiveData2 = [];
          this.chartOptionsLiveData3 = [];
          const data = res.data.data;
          console.log("get-small-charts-data");
          console.log(data);
          data.forEach(variableData => {
            variableData.forEach(element => {
              //var aux = [];
              const date = new Date(element.time).toLocaleString("es-CL", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
              });
              this.datetime_real_time.push(date);
              //aux.push(element.value);
              if (element.type === this.config.variableFullName) {
                this.chartOptionsLiveData.push(element.value);
              } else if (element.type === this.config.variableFullName2) {
                this.chartOptionsLiveData2.push(element.value);
              } else if (element.type === this.config.variableFullName3) {
                this.chartOptionsLiveData3.push(element.value);
              }
            });
          });
          this.isMounted = true;
        }
        this.getLastData();
      } catch (error) {
        console.log(error);
        this.errorMessage =
          "Error al obtener datos del dispositivo seleccionado";
        return;
      }
    },
    getIconColorClass() {
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
    procesReceivedData(data) {
      //console.log("ProcessREceived: ", data);
      try {
        if (data.currentType == this.config.variableFullName) {
          this.valueVariable = data.value;
        }
        if (data.currentType == this.config.variableFullName2) {
          this.valueVariable2 = data.value;
        }
        if (data.currentType == this.config.variableFullName3) {
          this.valueVariable3 = data.value;
        }

        setTimeout(() => {
          if (data.save == 1) {
            this.getChartData();
          }
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },
    getNow() {
      this.nowTime = Date.now();
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },
    getTimeAgo(seconds) {
      if (seconds < 0) {
        seconds = 0;
      }
      if (seconds < 59) {
        return seconds.toFixed() + " secs";
      }
      if (seconds > 59 && seconds <= 3600) {
        seconds = seconds / 60;
        return seconds.toFixed() + " min";
      }
      if (seconds > 3600 && seconds <= 86400) {
        seconds = seconds / 3600;
        return seconds.toFixed() + " hour";
      }
      if (seconds > 86400) {
        seconds = seconds / 86400;
        return seconds.toFixed() + " day";
      }
    }
  }
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
