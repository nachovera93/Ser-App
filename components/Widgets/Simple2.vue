<template>
  <div>
    <card :class="classes.p">
    <template>
      <h4 >
        {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h4>
      <h4>
         {{ config.variableFullName }}
      </h4>
      <div class="row ">
      <h4 >
        <span>{{ Number(value).toFixed(config.decimalPlaces) }} {{ config.unit }}</span>
      </h4>
      <!-- <h4 :class="classes.h3"> -->
        <!-- <span>{{ Number(value2).toFixed(config.decimalPlaces) }} {{ config.unit }}</span> -->
      <!-- </h4> -->
      </div>
    </template>
    </card>
  </div>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {
      activeColor: 'red',
      fontSize: 30,
      color: 'red',
      font: {
       weight: 200
      },
      receivedTime: 0,
      value: 0,
      value2: 1,
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
          
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable2;
          this.$nuxt.$on(this.topic + "/sdata", this.processReceivedData2);
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

  methods: {
    processReceivedData(data) {
      try {
        this.time = Date.now();
        this.value = data.value;
      } catch (error) {
        console.log(error);
      }
    },
    processReceivedData2(data) {
      try {
        this.time = Date.now();
        this.value2 = data.value;
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
<style module="classes">
.red {
  color: red;
}
.h2 {
  
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
    padding: 10px;
  }
.h3 {
  
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
    padding: 10px;
    margin-right: 150px;
  }
  .p {
  border: 5px solid red; 
  padding-left: 15px;
}
</style>