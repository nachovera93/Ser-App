<template>
  <div>
    
    <b-card :bg-variant="config.class">
      <b-tabs pills fill justified vertical>
        <b-tab class="text-center" :title="config.variableFullName" active>
          <b-card-text>
            {{ config.variableFullName }}
          </b-card-text>
          <h3>
            <span
              >{{ Number(value).toFixed(config.decimalPlaces) }}
              {{ config.unit }}</span
            >
          </h3>
        </b-tab>

        <b-tab class="text-center" :title="config.variableFullName2">
          <b-card-text>
            {{ config.variableFullName2 }}
          </b-card-text>
          <h3>
            <span
              >{{ Number(value).toFixed(config.decimalPlaces) }}
              {{ config.unit }}</span
            >
          </h3>
        </b-tab>

        <b-tab class="text-center" :title="config.variableFullName3">
          <b-card-text>
            {{ config.variableFullName3 }}
          </b-card-text>

          <h3>
            <span
              >{{ Number(value3).toFixed(config.decimalPlaces) }}
              {{ config.unit3 }}</span
            >
          </h3>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {
      activeColor: "red",
      fontSize: 30,
      color: "red",
      font: {
        weight: 200
      },
      receivedTime: 0,
      value: 0,
      value2: 0,
      value3: 0,
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

          this.value2 = 0;
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable2;
          this.$nuxt.$on(this.topic + "/sdata", this.processReceivedData2);

          this.value3 = 0;
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable3;
          this.$nuxt.$on(this.topic + "/sdata", this.processReceivedData3);
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

    processReceivedData3(data) {
      try {
        this.time = Date.now();
        //console.log(data.value)
        this.value3 = data.value;
        //console.log("Llego value 2")
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

<style>
.tabs-container {
  height: 400px;
  background: #d8d8d8;
}
</style>
