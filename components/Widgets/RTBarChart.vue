<template>
  <card type="chart">
    <template slot="header">
      <h5 class="card-category pull-right">
        {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h5>
      <h5 class="card-category">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h5>
      <h3 class="card-title">
        <i
          class="fa "
          :class="[config.icon, getIconColorClass()]"
          aria-hidden="true"
          style="font-size: 30px;"
        ></i>
        <span>{{ value.toFixed(config.decimalPlaces) }} {{ config.unit }}</span>
      </h3>
    </template>
    <div class="chart-area" style="height: 300px">
      <highchart
        style="height: 100%"
        v-if="isMounted"
        :options="chartOptions"
      />
    </div>
  </card>
</template>

<script>
export default {
  name: "barchart",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
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
          defaultSeriesType: "column",
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          type: "datetime",
          //tickInterval:3600 * 1000,
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
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 3600 * 1000 // one day
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
          
          
          console.log("wathc" ,this.chartOptions.chart.defaultSeriesType)
          console.log("wathc" ,this.chartOptions.series[0].color)
          this.chartOptions.series[0].name =
            this.config.variableFullName + " " + this.config.unit;
          this.updateColorClass();
          this.getChartData();
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
      

      var c = this.config.class;
      var types = this.config.tipo;
      if (types == "column") {
        console.log("tipo column")
        this.chartOptions.chart.defaultSeriesType = "column";
        console.log(" en types ", this.chartOptions.chart.defaultSeriesType )
      }
      if (types == "line") {
        console.log("tipo linea")
        this.chartOptions.chart.defaultSeriesType = "line";
        console.log(" en types ", this.chartOptions.chart.defaultSeriesType )
      }

      if (c == "success") {
        this.chartOptions.series[0].color = "#00f2c3";
      }
      if (c == "primary") {
        this.chartOptions.series[0].color = "#e14eca";
      }
      if (c == "warning") {
        this.chartOptions.series[0].color = "#ff8d72";
        console.log("color" , this.chartOptions.series[0].color)
      }
      if (c == "danger") {
        this.chartOptions.series[0].color = "#fd5d93";
      }

      this.chartOptions.series[0].name =
        this.config.variableFullName + " " + this.config.unit;
    },

    getChartData() {
      if (this.config.demo) {
        this.chartOptions.series[0].data = [
          [1606659071668, 22],
          [1606659072668, 27],
          [1606659073668, 32],
          [1606659074668, 7]
        ];
        this.chartOptions.chart.defaultSeriesType =
            this.config.tipo;
            console.log(" en demo ", this.chartOptions.chart.defaultSeriesType )
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
          console.log(res.data);

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