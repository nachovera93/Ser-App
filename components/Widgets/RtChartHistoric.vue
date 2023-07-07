<template>
  <b-card type="chart">
    <template slot="header">
      <div class="chartElem">
        <div
          class="col-sm-2
      "
        >
          <base-button
            @click="getDataBetween()"
            type="primary"
            class="mb-2"
            size="lg-2"
            >Filtrar</base-button
          >
        </div>
        <h5>{{ this.selected_radious }}</h5>
        <div>
          <b-form-group label="Individual radios" v-slot="{ ariaDescribedby }">
            <b-form-radio
              v-model="selected_radious"
              :aria-describedby="ariaDescribedby"
              name="some-radios"
              value="A"
              >Option A</b-form-radio
            >
            <b-form-radio
              v-model="selected_radious"
              :aria-describedby="ariaDescribedby"
              name="some-radios"
              value="B"
              >Option B</b-form-radio
            >
          </b-form-group>

          <div class="mt-3">
            Selected: <strong>{{ selected_radious }}</strong>
          </div>
        </div>
        <div v-if="this.selected_radious == 'A'">
          <h1>Si</h1>
        </div>
        <div v-else>
          <h1>No</h1>
        </div>
        <div class="card-category pull-right px-2">
          <label>Color</label>
          <b-form-select v-model="selected2" :options="colores" />
        </div>
        <div class="card-category pull-right px-2">
          <div id="chartType">
            <label>Chart Type</label>
            <b-form-select v-model="selected3" :options="chartTypes" />
          </div>
        </div>
        <div class="card-category pull-right">
          <label>Tiempo Atrás (min)</label>
          <b-form-select v-model="selected" :options="options" />
        </div>
        <h5>{{ getTimeAgo((nowTime - time) / 1000) }} ago</h5>

        <h4>
          {{ config.nombre }}
        </h4>

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
      </div>
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
    <h5>{{ this.config }}</h5>
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
    [TimeSelect.name]: TimeSelect
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
      selected3: this.config.tipo,
      options: [
        { value: 5, text: "5 minutos atrás" },
        { value: 10, text: "10 minutos atrás" },
        { value: 30, text: "30 minutos atrás" },
        { value: 60, text: "1 hora atrás" },
        { value: 120, text: "2 horas atrás" },
        { value: 180, text: "3 horas atrás" },
        { value: 720, text: "12 horas atrás" },
        { value: 1440, text: "1 día atrás" }
        //Semanal
        //Mensual
        //Anual
      ],
      timeback: [5, 10, 30, 60, 120, 180, 720, 1440],
      colores: ["success", "primary", "warning", "danger"],
      //graficos: ["column", "line", "spline", "area", "scatter", "areaspline"],
      chartType: "",
      chartTypes: [],
      chartOptioncolor: "",
      data: [],
      datetime: [],
      receivedTime: 0,
      value: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false,
      topic: ""
    };
  },
  watch: {
    selected(newVal) {
      this.config.chartTimeAgo = newVal;
      this.getChartData();
    },
    selected2(newVal2) {
      this.config.class = newVal2;
      this.updateColorClass(newVal2);
    },
    selected3(newVal3) {
      this.config.tipo = newVal3;
      this.chartType = newVal3;
      this.updateTipo(newVal3);
      console.log("Watch ", this.chartType);
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
          //console.log("ChartType")
          //console.log(this.chartType)
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
          this.chartOptions.xAxis.categories = [];
          this.getChartData();
          this.chartOptions.series[0].name =
            this.config.NameWidget + " " + this.config.unit;
          //this.updateTipo();
          window.dispatchEvent(new Event("resize"));
        }, 300);
      }
    }
  },
  computed: {
    chartOptions() {
      console.log("chartOptioncolor : ", this.chartOptioncolor);
      console.log("chartType : ", this.chartType);
      return {
        credits: {
          enabled: false
        },
        chart: {
          //renderTo: "container",
          defaultSeriesType: this.chartType,
          backgroundColor: "rgba(0,0,0,0)"
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: this.datetime,
          //type: "datetime",
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
        series: [
          {
            name: "",
            data: this.data,
            color: this.chartOptioncolor
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
      };
    }
  },
  mounted() {
    this.getNow();

    this.GetTipo();
    this.getLastData();
    this.chartTypes = this.$highcharts.chartTypes;
    console.log("charttypes ", this.$highcharts.chartTypes);
    //console.log("charttypes2 " ,this.chartTypes)
    //this.chartType = this.chartTypes[0];
    //const colordata = this.GetColorClass();
    this.GetColorClass();
    this.GetTipo();
    //this.chartOptioncolor="#00f2c3"
    //console.log("colordata " ,colordata)
    //this.chartOptions.chart.defaultSeriesType = this.chartTypes[0].toLowerCase();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },

  methods: {
    async GetColorClass() {
      console.log("rhis.config");
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
        //console.log("c: ", c);
        if (c == "success") {
          this.chartOptioncolor = "#00f2c3";
          //console.log("chartOptioncolor2 : ", this.chartOptioncolor);
          return;
          //this.chartOptions.series[0].color = "#00f2c3";
        }
        if (c == "primary") {
          this.chartOptioncolor = "#e14eca";
          //console.log("chartOptioncolor3 : ", this.chartOptioncolor);
          return;
          //this.chartOptions.series[0].color = "#e14eca";
        }
        if (c == "warning") {
          this.chartOptioncolor = "#ff8d72";
          
          //console.log("chartOptioncolor4 : ", this.chartOptioncolor);
          return;
          //this.chartOptions.series[0].color = "#ff8d72";
        }
        if (c == "danger") {
          this.chartOptioncolor = "#fd5d93";
          //console.log("chartOptioncolor5 : ", this.chartOptioncolor);
          return;
          //this.chartOptions.series[0].color = "#fd5d93";
        }
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
    async GetTipo() {
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
        const types = res.data.tipo.toLowerCase();
        console.log("types: ", types);
        if (types == "column") {
          console.log("column");
          //this.chartOptions.chart.defaultSeriesType = "column";
          this.config.tipo = "column";
          this.chartType = "column";
        }
        if (types == "line") {
          //this.chartOptions.chart.defaultSeriesType = "line";
          this.chartType = "line";
          this.config.tipo = "line";
        }
        if (types == "spline") {
          //this.chartOptions.chart.defaultSeriesType = "spline";
          this.chartType = "spline";
          this.config.tipo = "spline";
        }
        if (types == "area") {
          //this.chartOptions.chart.defaultSeriesType = "area";
          this.chartType = "area";
          this.config.tipo = "area";
        }
        if (types == "scatter") {
          //this.chartOptions.chart.defaultSeriesType = "scatter";
          this.chartType = "scatter";
          this.config.tipo = "scatter";
        }
        if (types == "areaspline") {
          //this.chartOptions.chart.defaultSeriesType = "areaspline";
          this.chartType = "areaspline";
          this.config.tipo = "areaspline";
        }
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
      //console.log("update " + this.config.tipo);
      console.log("update " + value3);
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
        dId: this.config.selectedDevice.dId,
        variable: this.config.variable,
        tipo: this.chartType
      };

      try {
        const res = await this.$axios.post("/post-tipo", toSend, axiosHeaders);

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

      var types = this.chartType.toLowerCase();
      console.log("Tipo ", types);
      if (types == "column") {
        //this.chartOptions.chart.defaultSeriesType = "column";
        this.chartType = "column";
        this.config.tipo = "column";
        console.log("Tipo2 ", types);
      }
      if (types == "line") {
        //this.chartOptions.chart.defaultSeriesType = "line";
        this.chartType = "line";
        this.config.tipo = "line";
        console.log("Tipo2 ", types);
      }
      if (types == "spline") {
        //this.chartOptions.chart.defaultSeriesType = "spline";
        this.chartType = "spline";
        this.config.tipo = "spline";
        console.log("Tipo2 ", types);
      }
      if (types == "area") {
        //this.chartOptions.chart.defaultSeriesType = "area";
        this.chartType = "area";
        this.config.tipo = "area";
        console.log("Tipo2 ", types);
      }
      if (types == "scatter") {
        //this.chartOptions.chart.defaultSeriesType = "scatter";
        this.chartType = "scatter";
        this.config.tipo = "scatter";
        console.log("Tipo2 ", types);
      }
      if (types == "areaspline") {
        //this.chartOptions.chart.defaultSeriesType = "areaspline";
        this.chartType = "areaspline";
        this.config.tipo = "areaspline";
        console.log("Tipo2 ", types);
      }
    },
    async updateColorClass(newVal2) {
      console.log("update " + this.config.class);
      console.log("update " + newVal2);
      var c = this.config.class;

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      const toSend = {
        dId: this.config.selectedDevice.dId,
        variable: this.config.variable,
        nameTemplate: this.config.selectedDevice.name,
        color: this.config.class
      };

      try {
        const res = await this.$axios.post("/post-color", toSend, axiosHeaders);

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Color updated!"
          });
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

      //var types = this.config.tipo;
      //if (types == "column") {
      //  this.chartOptions.chart.defaultSeriesType = "column";
      //}
      //if (types == "line") {
      //  this.chartOptions.chart.defaultSeriesType = "line";
      //}
      //if (types == "spline") {
      //  this.chartOptions.chart.defaultSeriesType = "spline";
      //}
      //if (types == "area") {
      //  this.chartOptions.chart.defaultSeriesType = "area";
      //}
      //if (types == "scatter") {
      //  this.chartOptions.chart.defaultSeriesType = "scatter";
      //}
      //if (types == "areaspline") {
      //  this.chartOptions.chart.defaultSeriesType = "areaspline";
      //}

      if (c == "success") {
        //this.chartOptions.series[0].color = "#00f2c3";
        this.chartOptioncolor = "#00f2c3";
      }
      if (c == "primary") {
        //this.chartOptions.series[0].color = "#e14eca";
        this.chartOptioncolor = "#e14eca";
      }
      if (c == "warning") {
        //this.chartOptions.series[0].color = "#ff8d72";
        this.chartOptioncolor = "#ff8d72";
      }
      if (c == "danger") {
        //this.chartOptions.series[0].color = "#fd5d93";
        this.chartOptioncolor = "#fd5d93";
      }
      this.chartOptions.series[0].name =
        this.config.NameWidget + " " + this.config.unit;
    },
    getLastData() {
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
            this.values = element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    getDataBetween() {
      console.log("DATE");
      this.timestamp_init = new Date(this.timestamp_init).getTime();
      this.timestamp_end = new Date(this.timestamp_end).getTime();
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable,
          timestamp_init: this.timestamp_init,
          timestamp_end: this.timestamp_end
        }
      };
      this.$axios
        .get("/get-data-between", axiosHeaders)
        .then(res => {
          this.chartOptions.series[0].data = [];
          //this.chartOptions.series[1].data = [];
          this.chartOptions.xAxis.categories = [];
          const data = res.data.data;
          //console.log(data[0].energia_fase_2_consumocliente_mensual);
          //console.log(data[0].energia_fase_2_redcompañia_mensual);
          data.forEach(element => {
            var aux2 = [];
            //var aux3 = [];
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
            //aux3.push(element.energia_fase_2_redcompañia_mensual);
            //console.log(element.energia_fase_2_consumocliente_mensual);
            //this.chartOptions.series[0].data.push(aux);
            //this.chartOptions.series[1].data.push(aux3);
            //this.chartOptions.xAxis.categories.push(aux2);
            this.data.push(aux);
            this.datetime.push(aux2);
          });
          //console.log(data[0].energia_fase_2_consumocliente_mensual);
          //console.log(this.chartOptions.xAxis.categories);
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
            this.value = element.value;
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
            this.value = element.value;
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    getIconColorClass() {
      //console.log("Color2");
      //const axiosHeaders = {
      //  headers: {
      //    token: $nuxt.$store.state.auth.token
      //  },
      //  params: {
      //    dId: this.config.selectedDevice.dId,
      //    variable: this.config.variable,
      //    timestamp_init: this.timestamp_init,
      //    timestamp_end: this.timestamp_end
      //  }
      //};
      //this.$axios
      //  .get("/widgetcolor", axiosHeaders)
      //  .then(res => {
      //
      //    console.log("Color2")
      //})
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
