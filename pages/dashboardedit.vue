<template>
  <div class="row" v-if="$store.state.devices.length > 0">

   <div class="row pull-right">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              @click="addNewWidget()"
            >
              Editar Plantilla
            </base-button>
          </div>
     </div>
    <h5>{{ $store.state.selectedDevice.template.widgets }}</h5>
    <div
      v-for="(widget, index) in $store.state.selectedDevice.template.widgets"
      :key="index"
      :class="[widget.column]"
    >
      <Rtnumberchart
        v-if="widget.widget == 'numberchart'"
        :config="fixWidget(widget)"
      ></Rtnumberchart>

      <DobleValue
        v-if="widget.widget == 'doblevalue'"
        :config="fixWidget(widget)"
      ></DobleValue>

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
        v-if="widget.widget == 'simplenumber'"
        :config="fixWidget(widget)"
      ></Simple>

      <Simple2
        v-if="widget.widget == 'simplenumber2'"
        :config="fixWidget(widget)"
      ></Simple2>
    </div>
  </div>

  <div v-else>
    Select a Device...
  </div>
</template>
<script>
export default {
  middleware: "authenticated",
  name: "Dashboard",
  data() {
    return {};
  },

  mounted() {},

  methods: {
    fixWidget(widget) {
      var widgetCopy = JSON.parse(JSON.stringify(widget));
      widgetCopy.selectedDevice.dId = this.$store.state.selectedDevice.dId;
      widgetCopy.selectedDevice.name = this.$store.state.selectedDevice.name;
      widgetCopy.userId = this.$store.state.selectedDevice.userId;

      if (widget.widget == "numberchart") {
        widgetCopy.demo = false;
      }
      if (widget.widget == "barchart") {
        widgetCopy.demo = false;
      }
      if (widget.widget == "doblechart") {
        widgetCopy.demo = false;
      }

      return widgetCopy;
    },
    addNewWidget() {
      
        this.ncConfig.variableFullName="hola"
        console.log(this.ncConfig.variableFullName)
        this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig.variableFullName)));
      
    }
  }
};
</script>
