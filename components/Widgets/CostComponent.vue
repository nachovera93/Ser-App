<template>
  <div>
    <b-card :bg-variant="config.class"  text-variant="dark"  class="text-center"> 
      <!-- :header="config.selectedDevice.name" Para poner titulo a la card-->
         <b-card-text> 
        {{ config.variableFullName }}
        </b-card-text> 
        
        <h3 >
          <span
            >{{ value.toFixed(config.decimalPlaces) }} {{ config.unit }}</span
          >
        </h3>
        
    </b-card>
  </div>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
      value2: false,
      time: Date.now(),
      nowTime: Date.now(),
      topic: ""
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
          this.$nuxt.$on(this.topic + "/sdata", this.processReceivedData);
        }, 300);
      }
    }
  },

  mounted() {
    this.getNow();
  },
  beforeDestroy() {
    this.$nuxt.$off(this.topic + "/sdata");
  },
  computed: {
    foo() {
      return this.value2 ? "success" : "warning"; //<--- define condition/s
    },
  },
  methods: {
    processReceivedData(data) {
      try {
        this.time = Date.now();
        this.value = data.value;
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
