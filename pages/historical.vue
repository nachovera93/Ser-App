<template>
  <!-- NEW ALARM FORM -->

  <div class="row">
    <div class="col-sm-12">
      <h1>Historicos</h1>
    </div>
    <div class="col-sm-4">
      <base-input>
        <el-date-picker
          v-model="date"
          type="datetime"
          placeholder="Selecciona Hora y Fecha"
        >
        </el-date-picker>
      </base-input>
    </div>
    <div class="col-sm-4">
      <base-button
        @click="DateTimestamp()"
        type="primary"
        class="mb-3"
        size="lg"
        >Filtrar</base-button
      >
    </div>

    <!--<div
      v-for="(widget, index) in this.templatesHistorical"
      :key="index"
      :class="[widget.column]"
    >
       <h5>{{ widget }}</h5> 
    </div>-->
    <div
      v-for="(widget, index) in this.templatesHistorical"
      :key="index"
      :class="[widget.column]"
    >
      <Rtnumberchart
        v-if="widget.widget == 'numberchart'"
        :config="fixWidget(widget)"
      ></Rtnumberchart>

      <RtChartHistoric
        v-if="widget.widget == 'charthistoric'"
        :config="fixWidget(widget)"
      ></RtChartHistoric>

      <EnergyChart
        v-if="widget.widget == 'energychart'"
        :config="fixWidget(widget)"
      ></EnergyChart>

      <RTDoblechart
        v-if="widget.widget == 'doblechart'"
        :config="fixWidget(widget)"
      ></RTDoblechart>
    </div>
  </div>
</template>

<script>
import { DatePicker, TimeSelect } from "element-ui";

export default {
  // components: { Datepicker },
  middleware: "authenticated",
  components: {
    [DatePicker.name]: DatePicker,
    [TimeSelect.name]: TimeSelect
  },
  data() {
    return {
      date: null,
      userId: "",
      datum: null,
      alarmRules: [],
      historical: [],
      historical2: [],
      templatesHistorical: [],
      templates: "",
      templateswidget: "",
      templatescolumn: ""
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.historical = [];
          this.getData();
        }, 300);
      }
    }
  },
  mounted() {
    this.Credentials();
    this.getTemplatesHistorical();
  },
  //
  methods: {
    DateTimestamp(date) {
      this.datum = this.date.getTime() - 4 * 3600;
      const axiosHeadersDate = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          datum: this.datum
        }
      };
      this.$axios
        .get("/get-historical", axiosHeadersDate)
        .then(res => {
          const data = res.data.data;
          //console.log(data)
          this.historical2 = [];
          data.forEach(data => {
            var aux = [];
            aux.push(data);
            console.log(aux.length);
            this.historical2.push(aux);
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    Credentials() {
      const axiosHeaders0 = {
        headers: {
          token: $nuxt.$store.state.auth.token
        }
      };
      this.$axios
        .get("/credentials", axiosHeaders0)
        .then(res => {
          const credentials = res.data.data;
          this.userId = credentials;
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    getData() {
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          userId: this.userId
        }
      };
      this.$axios
        .get("/get-historical", axiosHeaders)
        .then(res => {
          const data = res.data.data;
          data.forEach(element => {
            var aux = [];
            aux.push(element.value);
            this.historical.push(aux);
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
    async getTemplatesHistorical() {
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          userId: this.userId
        }
      };
      try {
        const res = await this.$axios.get("/templatehistorical", axiosHeaders);
        //console.log(res.data);
        if (res.data.status == "success") {
          this.templatesHistorical.push(res.data.data);
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates..."
        });
        console.log(error);
        return;
      }
    },
    fixWidget(widget) {
      var widgetCopy = JSON.parse(JSON.stringify(widget));

      if (widget.widget == "numberchart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "true";
      }
      if (widget.widget == "energychart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "true";
      }
      if (widget.widget == "doblechart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "true";
      }

      return widgetCopy;
    }
  }
};
</script>
