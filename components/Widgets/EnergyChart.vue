<template>
        <b-card type="chart">
          <h5>{{ this.Dia }}</h5>
          <template slot="header">
            <div class="cont d-flex justify-content-center">
              <div class="d-flex flex-row align-items-center">
                <h4 class="card-title mr-3">
                  <i
                    class="fa "
                    :class="[config.icon, getIconColorClass()]"
                    aria-hidden="true"
                    style="font-size: 30px;"
                  ></i>
                  <span
                    >{{ Number(valueVariable).toFixed(config.decimalPlaces) }}
                    {{ config.unit }}</span
                  >
                  <span
                    >{{ Number(valueVariable2).toFixed(config.decimalPlaces) }}
                    {{ config.unit }}</span
                  >
                  <span
                    >{{ Number(valueVariable3).toFixed(config.decimalPlaces) }}
                    {{ config.unit }}</span
                  >
                </h4>
                <base-input>
                  <select class="form-control" v-model="selected3">
                    <option
                      v-for="(TipoGrafico1, index) in chartTypes"
                      :key="index"
                      :value="TipoGrafico1"
                      >{{ TipoGrafico1 }}</option
                    >
                  </select>
                </base-input>
              </div>
            </div>
          </template>

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
          <!-- <h5>{{ config }}</h5> -->
          <h5>Tópico actual: {{ topic }}</h5>
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

      data_red: 0,
      data_carga: 0,
      data_paneles: 0,
      data_red_fase1: [],
      data_carga_fase1: [],
      data_paneles_fase1: [],
      data_red_fase2: [],
      data_carga_fase2: [],
      data_paneles_fase2: [],
      data_red_fase3: [],
      data_carga_fase3: [],
      data_paneles_fase3: [],
      EditDataCheckboxRed_Fase1: [],
      EditDataCheckboxRed_Fase2: [],
      EditDataCheckboxRed_Fase3: [],
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
      points: [10, 0, 8, 2, 6, 4, 5, 5],
      timestamp_init: null,
      timestamp_end: null,
      timestamp: null,
      seriesColor: "",
      colorInputIsSupported: null,
      chartTypes: [],
      watchers: undefined,
      colors: [
        "Red",
        "Green",
        "Blue",
        "Pink",
        "Orange",
        "Brown",
        "Black",
        "Purple"
      ],
      selected: 120,
      //selected2: this.config.class,
      selected3: this.config.tipo,
      TipoGrafico1: "",
      TipoGrafico2: "",
      chartOptioncolor: "",
      data_red_total: [],
      data_carga_total: [],
      data_paneles_total: [],
      data1Live: [],
      data2Live: [],
      data3Live: [],
      datetime: [],
      datetime_real_time: [],
      receivedTime: 0,
      valueVariable: 0,
      valueVariable2: 0,
      valueVariable3: 0,
      value: 0,
      value2: 0,
      value3: 0,
      valuecard: 0,
      value2card: 0,
      value3card: 0,
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
    seriesColor(newVal2) {
      this.seriesColor = newVal2;
      this.updateColorClass(newVal2);
    },
    selected3(newVal3) {
      //this.config.tipo = newVal3;
      //this.updateTipo(newVal3);
      //console.log("Watch Type", this.chartType);
    },
    Select_Phase_1(newValue) {
      // Aquí puedes hacer algo con el nuevo valor de la variable
      this.fase_1 = newValue;
      //console.log("Watch Select_Phase_1 ",newValue)
      this.EditDataCheckbox();
    },
    Select_Phase_2(newValue) {
      // Aquí puedes hacer algo con el nuevo valor de la variable
      this.fase_2 = newValue;
      //console.log("Watch Select_Phase_2 ",newValue)
      this.EditDataCheckbox();
    },
    Select_Phase_3(newValue) {
      this.fase_3 = newValue;
      // Aquí puedes hacer algo con el nuevo valor de la variable
      //console.log("Watch Select_Phase_3 ",newValue)
      this.EditDataCheckbox();
    },
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.valueVariable = 0;
          this.value = 0;
          this.value2 = 0;
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);
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
          type: this.TipoGrafico1
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
          itemStyle: {
            color: "#d4d2d2"
          }
        },
        series: [
          {
            name: "Energia 1",
            data: this.chartOptionsLiveData,
            color: "#e14eca"
          },
          {
            name: "Energia 2",
            data: this.chartOptionsLiveData2,
            color: "#00f2c3"
          },
          {
            name: "Energia 3",
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
          variable: this.config.variable
        }
      };
      try {
        const res = await this.$axios.get("/get-tipo", axiosHeaders);
        console.log(res.data);
        const types = res.data.tipoGrafico1.toLowerCase();
        const types2 = res.data.tipoGrafico2.toLowerCase();
        console.log("types: ", types);
        console.log("types2: ", types2);
        this.TipoGrafico2 = types2;
        this.TipoGrafico1 = types;
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
    //async updateTipo(value3) {
    //  //console.log("update " + this.config.tipo);
    //  console.log("update graph " + value3);
    //  this.chartType = value3.toLowerCase();
    //  console.log(this.chartType);
    //  const axiosHeaders = {
    //    headers: {
    //      token: this.$store.state.auth.token
    //    }
    //  };
    //  const toSend = {
    //    dId: this.config.selectedDevice.dId,
    //    variable: this.config.variable,
    //    tipo: value3
    //  };
    //
    //  try {
    //    const res = await this.$axios.post("/post-tipo", toSend, axiosHeaders);
    //    if (res.data.status == "success") {
    //      this.$notify({
    //        type: "success",
    //        icon: "tim-icons icon-alert-circle-exc",
    //        message: "Graph updated!"
    //      });
    //    }
    //  } catch (error) {
    //    this.$notify({
    //      type: "danger",
    //      icon: "tim-icons icon-alert-circle-exc",
    //      message: "Error Updating Graph..."
    //    });
    //    console.log(error);
    //    return;
    //  }
    //},
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
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      //console.log("TOKEN");
      //console.log($nuxt.$store.state.auth.token);
      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then(res => {
          console.log(res.data);
          const data = res.data.data;
          const data2 = res.data.data2;
          const data3 = res.data.data3;
          console.log("Data1: ", data);
          console.log("Data2: ", data2);
          console.log("Data3: ", data3);
          data.forEach(element => {
            this.valueVariable = element.value;
          });
          data2.forEach(element => {
            this.valueVariable2 = element.value;
          });
          data3.forEach(element => {
            this.valueVariable3 = element.value;
          });
          console.log("Data1: ", this.valueVariable);
          console.log("Data2: ", this.valueVariable2);
          console.log("Data3: ", this.valueVariable3);
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    async getChartData() {
      console.log("Entro getChartData");
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
          //Energy_Red_Phase_1:
          //Energy_Consumption_Pahse
          //Energy_Panels
          chartTimeAgo: this.config.chartTimeAgo
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
              const date = new Date(element.time * 1000).toLocaleString(
                "es-CL",
                {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric"
                }
              );
              this.datetime_real_time.push(date);
              //aux.push(element.value);
              if (element.variable === this.config.variable) {
                this.chartOptionsLiveData.push(element.value);
              } else if (element.variable === this.config.variable2) {
                this.chartOptionsLiveData2.push(element.value);
              } else if (element.variable === this.config.variable3) {
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
      console.log("ProcessREceived: ", data);
      try {
        this.time = Date.now();
        this.valueVariable = data.value;
        this.valueVariable2 = data.value2;
        this.valueVariable3 = data.value3;
        //const valueLocal = data.value;
        //const value2Local = data.value2;
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
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}

.card .row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.card .col {
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.card input[type="checkbox"] {
  margin-right: 10px;
}

@media (min-width: 576px) {
  .card .col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 768px) {
  .card .col {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

@media (min-width: 992px) {
  .card .col {
    flex: 0 0 25%;
    max-width: 25%;
  }
}

.container {
  display: flex;
  justify-content: center;
}

base-input {
  margin-right: 20px; /* Add a margin-right of 10px */
}

.checkboxes-container {
  display: flex;
  justify-content: center; /* center the checkboxes within the container */
}

@media (max-width: 767px) {
  /* Only apply this style on screens smaller than 768px (mobile) */
  .checkboxes-container {
    flex-wrap: wrap; /* wrap the checkboxes on multiple lines */
    justify-content: center; /* center the checkboxes within the container */
  }
}

@media (min-width: 768px) {
  /* Only apply this style on screens larger than 768px (tablet and larger) */
  .checkboxes-container {
    justify-content: center; /* center the checkboxes within the container */
  }
}

.cont {
  height: 100%;
}

@media (max-width: 600px) {
  .card-title {
    font-size: 14px;
  }
}
</style>
