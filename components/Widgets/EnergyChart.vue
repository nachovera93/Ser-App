<template>
  <b-card > 
    <!-- class="col-xs-12 col-sm-12 col-md-8 col-lg-6" -->
    <b-tabs fill justified>
      <b-tab class="col-xs-12" :title="config.nombre" active>
        <b-card  >
          <template slot="header">
            <div class="col-xs-2 col-sm-4 col-md-3 col-lg-2 card-category px-1 pull-right">
              <label>Color Grafico</label>
              <b-form-select v-model="selected2" :options="colores" />
            </div>
            <div class="col-xs-2 col-sm-4 col-md-4 col-lg-2 card-category px-1 pull-right">
              <label>Tiempo Atrás (Min)</label>
              <b-form-select v-model="selected" :options="options" />
            </div>
           

            <!-- <h5 class="card-category"> -->
            <!-- {{ config.selectedDevice.name }} - {{ config.variableFullName }} -->
            <!-- </h5> -->

            <h3 class="card-title">
              <i
                class="fa "
                :class="[config.icon, getIconColorClass()]"
                aria-hidden="true"
                style="font-size: 30px;"
              ></i>
              <!-- <span -->
                <!-- >{{ Number(value).toFixed(config.decimalPlaces) }} -->
                <!-- {{ config.unit }}</span -->
              <!-- > -->
            </h3>
          </template>

          <div class="chart-area" style="height: 300px">
            <highchart
              :animation="{ duration: config.animacion }"
              :exporting="true"
              style="height: 100%"
              v-if="isMounted"
              :options="chartOptions"
              :update="watchers"
            />
          </div>

          <!-- <h5>{{ config }}</h5> -->
        </b-card>
      </b-tab>

      <b-tab class="col-xs-4" :title="config.nombre2">
        <b-card class="col-xs-12" type="chart">
          <template slot="header">
            <div class="col-xs-3 col-sm-4 col-md-3 col-lg-2 card-category px-1 pull-right">
              <label>Color</label>
              <b-form-select v-model="selected3" :options="colores" />
            </div>
            <div class="col-xs-3 col-sm-4 col-md-3 col-lg-2 card-category px-1 pull-right">
              <label>Tiempo Atrás (Min)</label>
              <b-form-select v-model="selected" :options="options" />
            </div>
            

            <!-- <h5 class="card-category"> -->
            <!-- {{ config.selectedDevice.name }} - {{ config.variableFullName2 }} -->
            <!-- </h5> -->

            <h3 class="card-title">
              <i
                class="fa "
                :class="[config.icon, getIconColorClass()]"
                aria-hidden="true"
                style="font-size: 30px;"
              ></i>
              <!-- <span -->
                <!-- >{{ Number(value2).toFixed(config.decimalPlaces) }} -->
                <!-- {{ config.unit2 }}</span -->
              <!-- > -->
            </h3>
          </template>

          <div class="chart-area" style="height: 300px">
            <highchart
              :animation="{ duration: config.animacion }"
              :exporting="true"
              style="height: 100%"
              v-if="isMounted"
              :options="chartOptions2"
              :update="watchers"
            />
          </div>

          <!-- <h5>{{ config }}</h5> -->
        </b-card>
      </b-tab>
      <b-tab class="col-xs-4" :title="config.nombre3">
        <b-card class="col-xs-12" type="chart">
          <template slot="header">
            <div class="col-xs-3 col-sm-4 col-md-3 col-lg-2 card-category px-1 pull-right">
              <label>Color</label>
              <b-form-select v-model="selected4" :options="colores" />
            </div>
            <div class="col-xs-3 col-sm-4 col-md-3 col-lg-2 card-category px-1 pull-right">
              <label>Tiempo Atrás (Min)</label>
              <b-form-select v-model="selected" :options="options" />
            </div>
            

            <!-- <h5 class="card-category"> -->
            <!-- {{ config.selectedDevice.name }} - {{ config.variableFullName3 }} -->
            <!-- </h5> -->

            <h3 class="card-title">
              <i
                class="fa "
                :class="[config.icon, getIconColorClass()]"
                aria-hidden="true"
                style="font-size: 30px;"
              ></i>
              <!-- <span -->
                <!-- >{{ Number(value3).toFixed(config.decimalPlaces) }} -->
                <!-- {{ config.unit3 }}</span -->
              <!-- > -->
            </h3>
          </template>

          <div class="chart-area" style="height: 300px">
            <highchart
              :animation="{ duration: config.animacion }"
              :exporting="true"
              style="height: 100%"
              v-if="isMounted"
              :options="chartOptions3"
              :update="watchers"
            />
          </div>

          <!-- <h5>{{ config }}</h5> -->
        </b-card>
      </b-tab>
    </b-tabs>
    <!-- <h5>{{ config }}</h5> -->
  

 </b-card>
</template>

<script>
import("highcharts/highcharts").Options;
export default {
  name: "energychart",
  props: ["config"],
  data() {
    return {
      watchers: undefined,
      selected: 720,
      selected2:this.config.class,
      selected3:this.config.class2,
      selected4:this.config.class3,
      options: [
          { value: 5, text: '5 minutos atrás' },
          { value: 10, text: '10 minutos atrás' },
          { value: 30, text: '30 minutos atrás' },
          { value: 60, text: '1 hora atrás' },
          { value: 120, text: '2 horas atrás' },
          { value: 180, text: '3 horas atrás' },
          { value: 720, text: '12 horas atrás' },
          { value: 1440, text: '1 día atrás' },
            ],
      colores: [
          { value: "success", text: 'Verde' },
          { value: "primary", text: 'Morado' },
          { value: "warning", text: 'Naranjo' },
          { value: "danger", text: 'Rojo' }
            ],
      receivedTime: 0,
      value: 0,
      value2: 0,
      value3: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: "",
      chartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          renderTo: "container",
          defaultSeriesType: "spline",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca"
          }
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2"
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
      },
      chartOptions2: {
        credits: {
          enabled: false
        },
        chart: {
          renderTo: "container",
          defaultSeriesType: "spline",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca"
          }
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2"
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
      },
      chartOptions3: {
        credits: {
          enabled: false
        },
        chart: {
          renderTo: "container",
          defaultSeriesType: "spline",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2"
            }
          }
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
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            },
            pointStart: 2010
          }
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca"
          }
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2"
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
      }
    };
  },
  watch: {
    selected(newVal) {
      this.config.chartTimeAgo = newVal;
      this.getChartData();
    },
    selected2(newVal2) {
      this.config.class = newVal2;
      this.updateColorClass();
    },
    selected3(newVal3) {
      this.config.class2 = newVal3;
      this.updateColorClass();
    },
    selected4(newVal4) {
      this.config.class3 = newVal4;
      this.updateColorClass();
    },
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.value = 0;
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData);
          this.chartOptions.series[0].data = [];
          this.getChartData();
          this.chartOptions.series[0].name =
            this.config.variableFullName + " " + this.config.unit;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));

          this.value2 = 0;
          //this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable2;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData2);
          this.chartOptions2.series[0].data = [];
          this.getChartData();
          this.chartOptions2.series[0].name =
            this.config.variableFullName2 + " " + this.config.unit2;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));

          this.value3 = 0;
          //this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable3;
          this.$nuxt.$on(this.topic + "/sdata", this.procesReceivedData3);
          this.chartOptions3.series[0].data = [];
          this.getChartData();
          this.chartOptions3.series[0].name =
            this.config.variableFullName3 + " " + this.config.unit3;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));
        }, 300);
      }
    }
  },
  mounted() {
    this.getNow();
    this.updateColorClass();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    updateColorClass() {
      console.log("update" + this.config.class);
      var c = this.config.class;
      var c2 = this.config.class2;
      var c3 = this.config.class3;

      var types = this.config.tipo;
      if (types == "column") {
        this.chartOptions.chart.defaultSeriesType = "column";
        this.chartOptions2.chart.defaultSeriesType = "column";
        this.chartOptions3.chart.defaultSeriesType = "column";
      }
      if (types == "line") {
        this.chartOptions.chart.defaultSeriesType = "line";
        this.chartOptions2.chart.defaultSeriesType = "line";
        this.chartOptions3.chart.defaultSeriesType = "line";
      }
      if (types == "spline") {
        this.chartOptions.chart.defaultSeriesType = "spline";
        this.chartOptions2.chart.defaultSeriesType = "spline";
        this.chartOptions3.chart.defaultSeriesType = "spline";
      }
      if (types == "area") {
        this.chartOptions.chart.defaultSeriesType = "area";
        this.chartOptions2.chart.defaultSeriesType = "area";
        this.chartOptions3.chart.defaultSeriesType = "area";
      }
      if (types == "scatter") {
        this.chartOptions.chart.defaultSeriesType = "scatter";
        this.chartOptions2.chart.defaultSeriesType = "scatter";
        this.chartOptions3.chart.defaultSeriesType = "scatter";
      }
      if (types == "areaspline") {
        this.chartOptions.chart.defaultSeriesType = "areaspline";
        this.chartOptions2.chart.defaultSeriesType = "areaspline";
        this.chartOptions3.chart.defaultSeriesType = "areaspline";
      }

      if (c == "success") {
        this.chartOptions.series[0].color = "#00f2c3";
      }
      if (c2 == "success") {
        this.chartOptions2.series[0].color = "#00f2c3";
      }
      if (c3 == "success") {
        this.chartOptions3.series[0].color = "#00f2c3";
      }

      if (c == "primary") {
        this.chartOptions.series[0].color = "#e14eca";
      }
      if (c2 == "primary") {
        this.chartOptions2.series[0].color = "#e14eca";
      }
      if (c3 == "primary") {
        this.chartOptions3.series[0].color = "#e14eca";
      }

      if (c == "warning") {
        this.chartOptions.series[0].color = "#ff8d72";
      }
      if (c2 == "warning") {
        this.chartOptions2.series[0].color = "#ff8d72";
      }
      if (c3 == "warning") {
        this.chartOptions3.series[0].color = "#ff8d72";
      }

      if (c == "danger") {
        this.chartOptions.series[0].color = "#fd5d93";
      }
      if (c2 == "danger") {
        this.chartOptions2.series[0].color = "#fd5d93";
      }
      if (c3 == "danger") {
        this.chartOptions3.series[0].color = "#fd5d93";
      }
      this.chartOptions.series[0].name =
        this.config.variableFullName + " " + this.config.unit;
      this.chartOptions2.series[0].name =
        this.config.variableFullName2 + " " + this.config.unit2;
      this.chartOptions2.series[0].name =
        this.config.variableFullName3 + " " + this.config.unit3;
    },
    getChartData() {
      if (this.config.demo) {
        this.chartOptions.series[0].data = [
          [1606659071668, 22],
          [1606659072668, 27],
          [1606659073668, 32],
          [1606659074668, 7]
        ];
        this.chartOptions2.series[0].data = [
          [1606659071668, 10],
          [1606659072668, 27],
          [1606659073668, 32],
          [1606659074668, 10]
        ];
        this.chartOptions3.series[0].data = [
          [1606659071668, 0],
          [1606659072668, 7],
          [1606659073668, 22],
          [1606659074668, 10]
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
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then(res => {
          const data = res.data.data;
          data.forEach(element => {
            this.value=element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
      const axiosHeaders2 = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable2,
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      this.$axios
        .get("/get-last-data", axiosHeaders2)
        .then(res => {
          const data = res.data.data;
          data.forEach(element => {
            this.value2=element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
      const axiosHeaders3 = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable3,
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      this.$axios
        .get("/get-last-data", axiosHeaders3)
        .then(res => {
          const data = res.data.data;
          data.forEach(element => {
            this.value3=element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
      this.$axios
        .get("/get-small-charts-data", axiosHeaders)
        .then(res => {
          this.chartOptions.series[0].data = [];
          const data = res.data.data;
          console.log("Data1 ", res.data.data);

          data.forEach(element => {
            var aux = [];
            aux.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux.push(element.value);
            this.chartOptions.series[0].data.push(aux);
          });
          this.isMounted = true;
          //return;
        })
        .catch(e => {
          console.log(e);
          //return;
        });
      this.$axios
        .get("/get-small-charts-data", axiosHeaders2)
        .then(res => {
          this.chartOptions2.series[0].data = [];
          const data2 = res.data.data;
          console.log("Data2 ", res.data.data);
          data2.forEach(element => {
            var aux2 = [];
            aux2.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux2.push(element.value);
            this.chartOptions2.series[0].data.push(aux2);
          });
          this.isMounted = true;
          //return;
        })
        .catch(e => {
          console.log(e);
          //return;
        });
      this.$axios
        .get("/get-small-charts-data", axiosHeaders3)
        .then(res => {
          this.chartOptions3.series[0].data = [];
          const data3 = res.data.data;
          console.log("Data3 ", res.data.data);
          data3.forEach(element => {
            var aux3 = [];
            aux3.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux3.push(element.value);
            this.chartOptions3.series[0].data.push(aux3);
          });
          this.isMounted = true;
          //return;
        })
        .catch(e => {
          console.log(e);
          //return;
        });
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
      try {
        this.time = Date.now();
        this.value = data.value;
        setTimeout(() => {
          if (data.save == 1) {
            this.getChartData();
          }
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },

    procesReceivedData2(data) {
      try {
        console.log("Llego data", data);
        this.time = Date.now();
        this.value2 = data.value;
        setTimeout(() => {
          if (data.save == 1) {
            this.getChartData();
          }
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },

    procesReceivedData3(data) {
      try {
        console.log("Llego data", data);
        this.time = Date.now();
        this.value3 = data.value;
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
<style></style>
