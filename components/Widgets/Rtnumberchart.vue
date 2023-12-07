<template>
  <b-card type="chart">
    <template slot="header">
      <div class="card-category pull-right px-2">
        <label>Color</label>
        <b-form-select v-model="selected2" :options="colores" />
      </div>
      <div class="card-category pull-right">
        <label>Tiempo Atrás (min)</label>
        <b-form-select v-model="selected" :options="options" />
      </div>
      <h5>{{ getTimeAgo((nowTime - time) / 1000) }} ago</h5>

      <div class="col-sm-3 d-flex align-items-center">
        <b-form-checkbox
          v-model="isCheckboxChecked"
          size="sm"
        ></b-form-checkbox>
        <h4 class="mb-0">{{ config.nombre }}</h4>
      </div>

      <div class="col-sm-3 pull-right">
        <base-input>
          <el-date-picker
            v-model="timestamp_end"
            type="datetime"
            placeholder="Selecciona Hora y Fecha"
          >
          </el-date-picker>
        </base-input>
      </div>

      <div class="col-sm-3 pull-right">
        <base-input>
          <el-date-picker
            v-model="timestamp_init"
            type="datetime"
            placeholder="Selecciona Hora y Fecha"
          >
          </el-date-picker>
        </base-input>
      </div>

      <h3 class="card-title">
        <span>{{ formattedValue }}</span>
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
    <!-- <h5>{{ value }}</h5> -->
    <h5 v-if="isCheckboxChecked">{{ topic + "/sdata" }}</h5>
  </b-card>
</template>

<script>
import { DatePicker, TimeSelect } from "element-ui";
import("highcharts/highcharts").Options;
export default {
  name: "rtnumberchart",
  props: ["config"],
  components: {
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect,
  },
  data() {
    return {
      timestamp_init: null,
      timestamp_end: null,
      timestamp: null,
      selected_radious: "",
      watchers: undefined,
      selected: 60,
      selected2: this.config.class,
      isCheckboxChecked: false,
      options: [
        { value: 5, text: "5 minutos atrás" },
        { value: 10, text: "10 minutos atrás" },
        { value: 30, text: "30 minutos atrás" },
        { value: 60, text: "1 hora atrás" },
        { value: 120, text: "2 horas atrás" },
        { value: 180, text: "3 horas atrás" },
        { value: 720, text: "12 horas atrás" },
        { value: 1440, text: "1 día atrás" },
        //Semanal
        //Mensual
        //Anual
      ],
      timeback: [5, 10, 30, 60, 120, 180, 720, 1440],
      colores: ["success", "primary", "warning", "danger"],
      receivedTime: 0,
      value: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: "",
      chartOptions: {
        credits: {
          enabled: false,
        },
        chart: {
          renderTo: "container",
          defaultSeriesType: "areaspline",
          backgroundColor: "rgba(0,0,0,0)",
        },
        title: {
          text: "",
        },
        xAxis: {
          categories: [],
          //type: "datetime",
          labels: {
            style: {
              color: "#d4d2d2",
            },
          },
        },
        yAxis: {
          title: {
            text: "",
          },
          labels: {
            style: {
              color: "#d4d2d2",
              font: "11px Trebuchet MS, Verdana, sans-serif",
            },
          },
        },
        series: [
          {
            name: "",
            data: [],
            color: "#e14eca",
          },
        ],
        legend: {
          itemStyle: {
            color: "#d4d2d2",
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
      },
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
    //date(date) {
    //  console.log(this.date)
    //
    //},
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          //this.getLastData();
          //console.log(this.date)
          this.value = 0;
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
          this.chartOptions.series[0].data = [];
          this.chartOptions.xAxis.categories = [];
          this.getChartData();
          this.chartOptions.series[0].name =
            this.config.NameWidget + " " + this.config.unit;
          this.updateColorClass();
          window.dispatchEvent(new Event("resize"));
        }, 300);
      },
    },
  },
  computed: {
    formattedValue() {
      return (
        this.value.toFixed(this.config.decimalPlaces) + " " + this.config.unit
      );
    },
  },
  mounted() {
    this.getNow();
    this.updateColorClass();
    this.getLastData();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },

  methods: {
    updateColorClass() {
      console.log("update " + this.config.class);
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
        this.config.NameWidget + " " + this.config.unit;
    },
    getLastData() {
      console.log("Starting getLastData method");

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token, // Asegúrate de que la ruta del token es correcta
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
        },
      };

      console.log("Prepared axios headers and params:", axiosHeaders);

      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then((res) => {
          console.log("Response received from /get-last-data:", res);

          if (res.data && res.data.data) {
            console.log("Data found:", res.data.data);
            // Asumiendo que solo quieres el valor del último dato
            this.value = res.data.data.value;
            console.log("Updated value in component:", this.value);
          } else {
            console.log("No data found in response");
          }
        })
        .catch((error) => {
          console.error("Error fetching last data:", error);
        });
    },

    getDataBetween() {
      console.log("DATE");
      this.timestamp_init = new Date(this.timestamp_init).getTime();
      this.timestamp_end = new Date(this.timestamp_end).getTime();
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token,
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          timestamp_init: this.timestamp_init,
          timestamp_end: this.timestamp_end,
        },
      };
      this.$axios
        .get("/get-data-between", axiosHeaders)
        .then((res) => {
          this.chartOptions.series[0].data = [];
          this.chartOptions.xAxis.categories = [];
          const data = res.data.data;
          console.log(data[0].energia_fase_2_consumocliente_mensual);
          console.log(this.chartOptions.xAxis.categories);
          data.forEach((element) => {
            var aux2 = [];
            var dateFormat = new Date(element.time * 1000);
            aux2.push(
              dateFormat.getDate() +
                "/" +
                (dateFormat.getMonth() + 1) +
                "/" +
                dateFormat.getFullYear()
            );
            var aux = [];
            aux.push(element.energia_fase_2_consumocliente_mensual);
            //console.log(element.energia_fase_2_consumocliente_mensual);
            this.chartOptions.series[0].data.push(aux);
            this.chartOptions.xAxis.categories.push(aux2);
          });
          console.log(data[0].energia_fase_2_consumocliente_mensual);
          console.log(this.chartOptions.xAxis.categories);
          this.isMounted = true;
          return;
        })
        .catch((e) => {
          console.log(e);
          return;
        });
      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then((res) => {
          const data = res.data.data;
          data.forEach((element) => {
            this.value = element.value;
          });
          return;
        })
        .catch((e) => {
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
          [1606659074668, 7],
        ];
        this.isMounted = true;
        return;
      }

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token, // Asegúrate de que la ruta del token es correcta.
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          chartTimeAgo: this.config.chartTimeAgo,
        },
      };

      this.$axios
        .get("/get-small-charts-data", axiosHeaders)
        .then((response) => {
          if (response.data && response.data.data) {
            const seriesData = response.data.data.map((item) => {
              const localTime = new Date(item.timestamp).toLocaleString();
              return [localTime, Number(item.value)];
            });

            // Actualiza las series de Highcharts con los datos recibidos.
            this.chartOptions.series[0].data = seriesData;

            // Podrías necesitar re-renderizar el gráfico aquí si Highcharts no detecta
            // automáticamente los cambios en las opciones del gráfico.
            this.isMounted = true;
          } else {
            // Manejo del caso en que no hay datos.
            console.log("No data available for the chart.");
          }
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
          // Manejo del error al obtener los datos.
        });

      // Llamada para obtener el último valor y actualizarlo si es necesario.
      this.$axios
        .get("/api/get-last-data", axiosHeaders)
        .then((response) => {
          if (response.data && response.data.data) {
            // Suponiendo que solo te interesa el último valor.
            this.value = Number(response.data.data[0].value);
          }
        })
        .catch((error) => {
          console.error("Error fetching the last data point:", error);
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
    },
  },
};
</script>
<style></style>
