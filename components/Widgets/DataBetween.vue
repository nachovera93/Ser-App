<template>
  <div>
    <b-card class="card">
      <template slot="header">
        <div class="checkboxes-container">
          <base-checkbox
            inline
            class="mb-3"
            value="fase_1"
            v-model="Select_Phase_1"
          >
            Fase 1
          </base-checkbox>
          <base-checkbox
            inline
            class="mb-3"
            value="fase_2"
            v-model="Select_Phase_2"
          >
            Fase 2
          </base-checkbox>
          <base-checkbox
            inline
            class="mb-3"
            value="fase_3"
            v-model="Select_Phase_3"
          >
            Fase 3
          </base-checkbox>
          <base-input>
            <select
              class="form-control"
              v-model="selected3"
              id="exampleFormControlSelect1"
            >
              <option
                v-for="(TipoGrafico2, index) in chartTypes"
                :key="index"
                :value="TipoGrafico2"
                >{{ TipoGrafico2 }}</option
              >
            </select>
          </base-input>
        </div>
        <div class="container d-flex">
          <base-input class="mx-3">
            <el-date-picker
              v-model="timestamp_init"
              type="datetime"
              placeholder="Selecciona Fecha inicio"
            >
            </el-date-picker>
          </base-input>

          <base-input class="mx-3">
            <el-date-picker
              v-model="timestamp_end"
              type="datetime"
              placeholder="Selecciona Fecha final"
            >
            </el-date-picker>
          </base-input>
          <base-button
            @click="getDataBetween()"
            size="sm"
            type="primary"
            class="mx-3"
            >Filtrar</base-button
          >
        </div>
      </template>
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="chart-area" style="height: 300px">
            <highchart
              :animation="{ duration: config.animacion }"
              :options="chartOptions"
              :exporting="true"
              style="height: 100%"
              v-if="isMounted"
            />
          </div>
        </div>
        <div class="col-12 col-md-4 d-none d-md-block">
          <div class="table-responsive">
            <b-table
              :items="formattedTableData"
              :fields="tableFields"
              small
              class="table-sm text-center small"
            ></b-table>
          </div>
        </div>
      </div>
      <div class="row d-md-none">
        <div class="col-12">
          <div class="table-responsive">
            <b-table
              :items="formattedTableData"
              :fields="tableFields"
              small
              class="table-sm text-center small"
            ></b-table>
          </div>
        </div>
      </div>
    </b-card>
    <!-- <h5>{{ config }}</h5> -->
  </div>
</template>







<script>
import { DatePicker, TimeSelect } from "element-ui";
import("highcharts/highcharts").Options;
export default {
  name: "Bettewnchart",
  props: ["config"],
  components: {
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect
  },
  data() {
    return {
      tableFields: [
        { key: "name", label: "Name" },
        { key: "value", label: "Value" }
      ],
      //Variables: {
      fase_1: false,
      fase_2: false,
      fase_3: false,
      showKwh: false,
      //},
      promedio_energia_fase_1_redcompañia_mensual: null,
      promedio_energia_fase_2_redcompañia_mensual: null,
      promedio_energia_fase_3_redcompañia_mensual: null,
      max_energia_fase_1_redcompañia_mensual: null,
      max_energia_fase_2_redcompañia_mensual: null,
      max_energia_fase_3_redcompañia_mensual: null,
      min_energia_fase_1_redcompañia_mensual: null,
      min_energia_fase_2_redcompañia_mensual: null,
      min_energia_fase_3_redcompañia_mensual: null,

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
      timestamp_init: null,
      timestamp_end: null,
      timestamp: null,
      seriesColor: "",
      colorInputIsSupported: null,
      selected: 120,
      //selected2: this.config.class,
      selected3: this.config.tipo,
      Select_Phase_1: false,
      Select_Phase_2: false,
      Select_Phase_3: false,

      TipoGrafico1: "",
      TipoGrafico2: "",
      DBcolor: "",
      chartOptioncolor: "",
      data_red_total: [],
      data_carga_total: [],
      data_paneles_total: [],
      data1Live: [],
      data2Live: [],
      data3Live: [],
      datetime: [],
      valuecard: 0,
      value2card: 0,
      value3card: 0,
      timeago: this.config.chartTimeAgo,
      time: Date.now(),
      nowTime: Date.now(),
      isMounted: false
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
    }
  },
  computed: {
    chartOptions() {
      return {
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor: "rgba(0,0,0,0)",
          className: "my-chart",
          type: this.TipoGrafico2
        },
        yAxis: {
          title: {
            text: "KWh"
          },
          labels: {
            style: {
              color: "#d4d2d2",
              font: "11px Trebuchet MS, Verdana, sans-serif"
            }
          }
        },
        title: {
          text: "Cantidad de Energia"
        },
        legend: {
          itemStyle: {
            color: "#d4d2d2"
          }
        },
        series: [
          {
            name: "Energia Red",
            data: this.data_red_total,
            color: "#1a1fa8"
          },
          {
            name: "Energia Carga",
            data: this.data_carga_total,
            color: "#20a729"
          },
          {
            name: "Energia Paneles",
            data: this.data_paneles_total,
            color: "#e1efe2"
          }
        ],
        xAxis: {
          categories: this.datetime,
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
    },
    formattedTableData() {
      let data = [
        {
          name: "Avg Energy Phase 1 Red",
          value: this.promedio_energia_fase_1_redcompañia_mensual
        },
        {
          name: "Avg Energy Phase 2 Red",
          value: this.promedio_energia_fase_2_redcompañia_mensual
        },
        {
          name: "Avg Energy Phase 3 Red",
          value: this.promedio_energia_fase_3_redcompañia_mensual
        },
        {
          name: "Max Energy Phase 1 Red",
          value: this.max_energia_fase_1_redcompañia_mensual
        },
        {
          name: "Max Energy Phase 2 Red",
          value: this.max_energia_fase_2_redcompañia_mensual
        },
        {
          name: "Max Energy Phase 3 Red",
          value: this.max_energia_fase_3_redcompañia_mensual
        },
        {
          name: "Min Energy Phase 1 Red",
          value: this.min_energia_fase_1_redcompañia_mensual
        },
        {
          name: "Min Energy Phase 2 Red",
          value: this.min_energia_fase_2_redcompañia_mensual
        },
        {
          name: "Min Energy Phase 3 Red",
          value: this.min_energia_fase_3_redcompañia_mensual
        }
      ];

      if (this.showKwh) {
        data = data.map(item => {
          return {
            name: item.name,
            value: item.value + " KWh"
          };
        });
      }

      return data;
    }
  },
  mounted() {
    //console.log("ENTRO getDataBetween");
    console.log(this.config.selectedDevice.dId);
    const i = document.createElement("input");
    i.setAttribute("type", "color");
    this.colorInputIsSupported = i.type === "color";
    this.chartTypes = this.$highcharts.chartTypes;
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  methods: {
    getDataBetween() {
      this.timestamp_init = new Date(this.timestamp_init).getTime();
      this.timestamp_end = new Date(this.timestamp_end).getTime();
      //onsole.log("Token: ",$nuxt.$store.state.auth.token)
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
          //this.data_red = res.data.energia_total_redcompañia_mensual;
          //this.data_carga = res.data.energia_total_carga_mensual;
          //this.data_paneles = res.data.energia_total_paneles_mensual;
          console.log("AVG");

          this.promedio_energia_fase_1_redcompañia_mensual = res.data.promedio_energia_fase_1_redcompañia_mensual.toFixed(
            2
          );
          console.log(this.promedio_energia_fase_1_redcompañia_mensual);
          this.promedio_energia_fase_2_redcompañia_mensual = res.data.promedio_energia_fase_2_redcompañia_mensual.toFixed(
            2
          );
          this.promedio_energia_fase_3_redcompañia_mensual = res.data.promedio_energia_fase_3_redcompañia_mensual.toFixed(
            2
          );
          this.max_energia_fase_1_redcompañia_mensual = res.data.max_energia_fase_1_redcompañia_mensual.toFixed(
            2
          );
          this.max_energia_fase_2_redcompañia_mensual = res.data.max_energia_fase_2_redcompañia_mensual.toFixed(
            2
          );
          this.max_energia_fase_3_redcompañia_mensual = res.data.max_energia_fase_3_redcompañia_mensual.toFixed(
            2
          );
          this.min_energia_fase_1_redcompañia_mensual = res.data.min_energia_fase_1_redcompañia_mensual.toFixed(
            2
          );
          this.min_energia_fase_2_redcompañia_mensual = res.data.min_energia_fase_2_redcompañia_mensual.toFixed(
            2
          );
          this.min_energia_fase_3_redcompañia_mensual = res.data.min_energia_fase_3_redcompañia_mensual.toFixed(
            2
          );
          this.data_red_fase1 = res.data.energia_fase1_redcompañia_mensual;
          this.data_carga_fase1 = res.data.energia_fase1_carga_mensual;
          this.data_paneles_fase1 = res.data.energia_fase1_paneles_mensual;
          this.data_red_fase2 = res.data.energia_fase2_redcompañia_mensual;
          this.data_carga_fase2 = res.data.energia_fase2_carga_mensual;
          this.data_paneles_fase2 = res.data.energia_fase2_paneles_mensual;
          this.data_red_fase3 = res.data.energia_fase3_redcompañia_mensual;
          this.data_carga_fase3 = res.data.energia_fase3_carga_mensual;
          this.data_paneles_fase3 = res.data.energia_fase3_paneles_mensual;
          this.datetime = res.data.time;
          this.Select_Phase_1 = true;
          this.Select_Phase_2 = true;
          this.Select_Phase_3 = true;

          this.EditDataCheckbox();
          this.isMounted = true;
          this.showKwh = true;

          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    EditDataCheckbox() {
      //console.log("Edit DataCheckbox")

      this.data_red_total = [];
      this.data_paneles_total = [];
      this.data_carga_total = [];
      //this.fase_1=this.fase__1;
      if (this.fase_1 && !this.fase_2 && !this.fase_3) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(this.data_red_fase1[i]);
          this.data_carga_total.push(this.data_carga_fase1[i]);
          this.data_paneles_total.push(this.data_paneles_fase1[i]);
        }
      }
      if (this.fase_2 && !this.fase_1 && !this.fase_3) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(this.data_red_fase2[i]);
          this.data_carga_total.push(this.data_carga_fase2[i]);
          this.data_paneles_total.push(this.data_paneles_fase2[i]);
        }
      }
      if (this.fase_3 && !this.fase_2 && !this.fase_1) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(this.data_red_fase3[i]);
          this.data_carga_total.push(this.data_carga_fase3[i]);
          this.data_paneles_total.push(this.data_paneles_fase3[i]);
        }
      }
      if (this.fase_1 && this.fase_2 && !this.fase_3) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(
            this.data_red_fase1[i] + this.data_red_fase2[i]
          );
          this.data_carga_total.push(
            this.data_carga_fase1[i] + this.data_carga_fase2[i]
          );
          this.data_paneles_total.push(
            this.data_paneles_fase1[i] + this.data_paneles_fase2[i]
          );
        }
      }
      if (this.fase_1 && this.fase_3 && !this.fase_2) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(
            this.data_red_fase1[i] + this.data_red_fase2[i]
          );
          this.data_carga_total.push(
            this.data_carga_fase1[i] + this.data_carga_fase2[i]
          );
          this.data_paneles_total.push(
            this.data_paneles_fase1[i] + this.data_paneles_fase2[i]
          );
        }
      }
      if (this.fase_2 && this.fase_3 && !this.fase_1) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(
            this.data_red_fase3[i] + this.data_red_fase2[i]
          );
          this.data_carga_total.push(
            this.data_carga_fase3[i] + this.data_carga_fase2[i]
          );
          this.data_paneles_total.push(
            this.data_paneles_fase3[i] + this.data_paneles_fase2[i]
          );
        }
      }

      if (this.fase_1 && this.fase_2 && this.fase_3) {
        for (let i = 0; i < this.data_red_fase1.length; i++) {
          this.data_red_total.push(
            this.data_red_fase1[i] +
              this.data_red_fase2[i] +
              this.data_red_fase3[i]
          );
          this.data_carga_total.push(
            this.data_carga_fase1[i] +
              this.data_carga_fase2[i] +
              this.data_carga_fase3[i]
          );
          this.data_paneles_total.push(
            this.data_paneles_fase1[i] +
              this.data_paneles_fase2[i] +
              this.data_paneles_fase3[i]
          );
        }
      }
    },
    async GetTipo() {
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
.b-card {
  font-size: 0.8rem;
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
