<template>
  <div class="row" v-if="$store.state.devices.length > 0">
    <div class="col-4">
      <h3>Hola Ricardo</h3>

      <!-- Esto aplica el ancho de la columna -->
      <h4>Energia acumulada de <code>hoy</code>: X KWh</h4>
      <b-img
        :src="`/img/Paneles_card.png`"
        fluid
        alt="Responsive image"
      ></b-img>
      <!-- <h1>{{ config.selectedImage }}</h1> -->
    </div>
    <div
      v-for="(widget, index) in sortedWidgets"
      :key="index"
      :class="getResponsiveClass(widget)"
    >
      <!-- <h5>{{ widget.widget }}</h5> -->
      <Rtnumberchart
        v-if="widget.widget == 'numberchart'"
        :config="fixWidget(widget)"
      ></Rtnumberchart>

      <RtChartHistoric
        v-if="widget.widget == 'charthistoric'"
        :config="fixWidget(widget)"
      ></RtChartHistoric>

      <EnergyChart
        v-if="widget.widget == 'multiple_chart'"
        :config="fixWidget(widget)"
      ></EnergyChart>

      <RTDoblechart
        v-if="widget.widget == 'doblechart'"
        :config="fixWidget(widget)"
      ></RTDoblechart>

      <RTBarChart
        v-if="widget.widget == 'barchart'"
        :config="fixWidget(widget)"
      ></RTBarChart>

      <Iotswitch
        v-if="widget.widget == 'switch'"
        :config="fixWidget(widget)"
      ></Iotswitch>

      <Iotbutton
        v-if="widget.widget == 'button'"
        :config="fixWidget(widget)"
      ></Iotbutton>

      <Iotindicator
        v-if="widget.widget == 'indicator'"
        :config="fixWidget(widget)"
      ></Iotindicator>

      <Simple
        v-if="widget.widget == 'simple'"
        :config="fixWidget(widget)"
      ></Simple>

      <SimpleTable
        v-if="widget.widget == 'TableSimple'"
        :config="fixWidget(widget)"
      ></SimpleTable>
      <CardImage
        v-if="widget.widget == 'ImageConfig'"
        :config="fixWidget(widget)"
      ></CardImage>
    </div>
    <!-- <Wheater></Wheater> -->
    <!-- <div><PhotoFile /></div> -->
  </div>

  <div v-else>Select a Device...</div>
</template>
<script>
//import PhotoFile from "./components/widgets/PhotoFile";
export default {
  middleware: "authenticated",
  name: "Dashboard",
  //components: {
  //  PhotoFile
  //},
  data() {
    return {};
  },

  mounted() {},
  computed: {
    sortedWidgets() {
      if (
        this.$store.state.selectedDevice &&
        this.$store.state.selectedDevice.template
      ) {
        return [...this.$store.state.selectedDevice.template.widgets].sort(
          (a, b) => a.order - b.order
        );
      }
      return [];
    },
  },

  methods: {
    sortWidgets() {
      if (
        this.$store.state.selectedDevice &&
        this.$store.state.selectedDevice.template
      ) {
        this.$store.state.selectedDevice.template.widgets.sort(
          (a, b) => a.order - b.order
        );
      }
    },

    fixWidget(widget) {
      var widgetCopy = JSON.parse(JSON.stringify(widget));
      widgetCopy.selectedDevice.dId = this.$store.state.selectedDevice.dId;
      widgetCopy.selectedDevice.name = this.$store.state.selectedDevice.name;
      widgetCopy.userId = this.$store.state.selectedDevice.userId;

      if (widget.widget == "numberchart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "false";
      }
      if (widget.widget == "charthistoric") {
        widgetCopy.demo = false;
        widgetCopy.historical = "false";
      }
      if (widget.widget == "multiple_chart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "false";
      }
      if (widget.widget == "doblechart") {
        widgetCopy.demo = false;
        widgetCopy.historical = "false";
      }

      return widgetCopy;
    },
    getResponsiveClass(widget) {
      if (widget.widget === "simple") {
        const originalSize = parseInt(widget.column.match(/\d+/)[0]);
        return `col-12 col-md-${originalSize}`;
      } else {
        // Retorna las clases originales para los demás widgets
        return widget.column;
      }
    },
  },
};
</script>
