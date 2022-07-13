<template>
  <b-card >
    <b-tabs >
      <b-tab  active>
        <template #title>
          <p>{{ config.variableFullName }}</p>
        </template>
        <b-card >
          <template slot="header">
            <h5 class="card-category pull-right">
              {{ getTimeAgo((nowTime - time) / 1000) }} ago
            </h5>
            <h2 class="card-category">
              {{ config.selectedDevice.name }} - {{ config.variableFullName }}
            </h2>
            <h3 class="card-title">
              <span
                >{{ Number(value).toFixed(config.decimalPlaces) }}
                {{ config.unit }}</span
              >
            </h3>
            <h4>{{config}}</h4>
          </template>
        </b-card>
      </b-tab>

      <b-tab>
        <template #title>
          <p>{{ config.variableFullName2 }}</p>
        </template>
        <card>
          <template slot="header">
            <h5 class="card-category pull-right">
              {{ getTimeAgo((nowTime - time) / 1000) }} ago
            </h5>
            <h2 class="card-category">
              {{ config.selectedDevice.name }} - {{ config.variableFullName2 }}
            </h2>
            <h3 class="card-title">
              <span
                >{{ Number(value2).toFixed(config.decimalPlaces) }}
                {{ config.unit2 }}</span
              >
            </h3>
            <h4>{{config}}</h4>
          </template>
           </card>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  name: "doblevalue",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
      value2: 0,
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
          //this.$nuxt.$off(this.topic + "/sdata");
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
        //console.log("RECEIVED");
        console.log(data);
        this.value = data.value;
      } catch (error) {
        console.log(error);
      }
    },

    processReceivedData2(data) {
      try {
        this.time = Date.now();
        //console.log(data.value)
        this.value2 = data.value;
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
