<template>
  <card class="col-lg-3">
    <div slot="header">
      <h4 class="card-title">
        {{ config.selectedDevice.name }} - {{ config.variableFullName }}
      </h4>
    </div>

    <i
      class="fa "
      :class="[config.icon, getIconColorClass()]"
      style="font-size: 30px"
    ></i>

    <base-button  @click="sendValue()" :type="config.class" class="mb-3 pull-right" size="lg">{{config.text}}</base-button>
  </card>
</template>

<script>
export default {
  props: ['config'],
  data() {
    return {
      //sending: false,
      value: false,
      topic: "",
      topic1: "",
      props: ['config'] 
    };
  },

   /*watch:  {
            
            config: {
                immediate: true,
                deep: true,
                handler() {
                    setTimeout(() => {
                        this.value = false;
                        console.log("watch")
                        this.$nuxt.$off(this.topic);
                        //Message from topic 6141e806a12fd20015e25c68/123454321/2EBl7kjdW3/sdata
                        // -----------------> userId/dId/uniquestr/sdata
                        const topic = this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata";
                        this.$nuxt.$on(topic, this.processReceivedData);
                        //se suscribe a userid/8888/var11/actdata
                    }, 300);
                }
            }
        },
   */
  mounted(){
      //userId/dId/uniquestr/sdata
    const topic = this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/sdata";
    console.log("mounted");
    console.log(topic);
    console.log("value", this.value);
    this.$nuxt.$on(topic, this.processReceivedData)
  },
  beforeDestroy(){
    this.$nuxt.$off(this.topic1);
  },
  methods: {

    sendValue() {
        
        this.value = !this.value;
        const toSend = {
            topic1: this.config.userId + "/" + this.config.selectedDevice.dId + "/" + this.config.variable + "/actdata",
            msg: {
                value: this.config.message
            }
        };
        //enviamos a userid/8888/var11/actdata
        console.log(toSend);
        this.$nuxt.$emit('mqtt-sender', toSend);
        //this.getIconColorClass()
    },
    processReceivedData(data){
        console.log("received");
        console.log(data);
        this.value = data.value;
    },
      
    getIconColorClass() {
      console.log("received 2");
      console.log("value", this.value);
      if (!this.value) {
        console.log("apagado");
        return "text-dark";
      }
      if (this.config.class == "success") {
        console.log("prendido success");
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
    }
  }
};
</script>