<template>
  <b-card type="chart">
    <template slot="header">
      <div class="card-category pull-right px-2">
        <label>Color</label>
        <b-form-select v-model="selected2" :options="colores" />
      </div>
      <div class="card-category pull-right px-2">
        <label>Tiempo Atrás (min)</label>
        <b-form-select v-model="selected" :options="timeback" />
      </div>
      <h5>{{ getTimeAgo((nowTime - time) / 1000) }} ago</h5>

      <h4 >
        {{ config.nombre }}
      </h4>

      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <span
          >{{ Number(value).toFixed(config.decimalPlaces) }}
          {{ config.unit }}</span
        >
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
</template>

<script>
import("highcharts/highcharts").Options;
export default {
  name: "rtnumberchart",
  props: ["config"],
  data() {
    return {
      watchers: undefined,
      selected: 60,
      selected2:this.config.class,
      timeback: [5, 10, 30, 60, 120, 180, 720, 1440],
      colores:["success","primary","warning","danger"],
      receivedTime: 0,
      value: 0,
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
          defaultSeriesType: "areaspline",
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
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          //this.getLastData();
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
        }, 300);
      }
    }
  },

  mounted() {
    this.getNow();
    this.updateColorClass();
    //this.getLastData();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },

  methods: {
    updateColorClass() {
      console.log("update" + this.config.class);
      var c = this.config.class;

      var types = this.config.tipo;
      if (types == "column") {
        this.chartOptions.chart.defaultSeriesType = "column";
      }
      if (types == "line") {
        this.chartOptions.chart.defaultSeriesType = "line";
      }
      if (types == "spline") {
        this.chartOptions.chart.defaultSeriesType = "spline";
      }
      if (types == "area") {
        this.chartOptions.chart.defaultSeriesType = "area";
      }
      if (types == "scatter") {
        this.chartOptions.chart.defaultSeriesType = "scatter";
      }
      if (types == "areaspline") {
        this.chartOptions.chart.defaultSeriesType = "areaspline";
      }

      if (c == "success") {
        this.chartOptions.series[0].color = "#00f2c3";
      }
      if (c == "primary") {
        this.chartOptions.series[0].color = "#e14eca";
      }
      if (c == "warning") {
        this.chartOptions.series[0].color = "#ff8d72";
      }
      if (c == "danger") {
        this.chartOptions.series[0].color = "#fd5d93";
      }
      this.chartOptions.series[0].name =
        this.config.variableFullName + " " + this.config.unit;
    },
    getLastData(){
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
            this.values=element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    getChartData() {
      if (this.config.demo) {
        this.chartOptions.series[0].data = [
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
          chartTimeAgo: this.config.chartTimeAgo
        }
      };
      this.$axios
        .get("/get-small-charts-data", axiosHeaders)
        .then(res => {
          this.chartOptions.series[0].data = [];
          const data = res.data.data;
          //console.log(res.data);
          data.forEach(element => {
            var aux = [];
            aux.push(
              element.time + new Date().getTimezoneOffset() * 60 * 1000 * -1
            );
            aux.push(element.value);
            this.chartOptions.series[0].data.push(aux);
          });
          this.isMounted = true;
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
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
