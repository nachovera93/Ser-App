<template>



  <div class="row" v-if="$store.state.devices.length > 0">

    <div
      v-for="(widget, index) in $store.state.selectedDevice.template.widgets"
      :key="index"
      :class="[widget.column]"

    >

       <DataBetween
        v-if="widget.widget == 'DataBetween'"
        :config="fixWidget(widget)"
      ></DataBetween>


    </div>
  </div>

  <div v-else>
    Select a Device...
  </div>


</template>
<script>
//import PhotoFile from "./components/widgets/PhotoFile";
export default {
  middleware: 'authenticated',
  name: 'Historical',
  //components: {
  //  PhotoFile
  //},
  data() {
    return {


    }
  },

  mounted() {


  },

  methods: {

    fixWidget(widget){
      var widgetCopy = JSON.parse(JSON.stringify(widget));
      widgetCopy.selectedDevice.dId = this.$store.state.selectedDevice.dId;
      widgetCopy.selectedDevice.name = this.$store.state.selectedDevice.name;
      widgetCopy.userId = this.$store.state.selectedDevice.userId;


      if (widget.widget =="DataBetween"){
        widgetCopy.demo = false;
         widgetCopy.historical = 'false';
      }

      return widgetCopy;
    }

  }

};
</script>
