<template>
  <div>
    <b-card
      :bg-variant="config.class"
      text-variant="dark"
      class="text-center mb-0"
      style="max-height: 7rem;"
    >
      <!-- :header="config.selectedDevice.name" Para poner titulo a la card-->

      <b-card-text>
        {{ config.nombre }}
      </b-card-text>

      <b-card-text class="mt-2">
        <span
          >{{ Number(value).toFixed(config.decimalPlaces) }} -
          {{ config.unit }}</span
        >
      </b-card-text>
      <h6 class="card-category mt-2">
        Last updated {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h6>
    </b-card>
    <h5>{{ config }}</h5>
    <h5>Tópico actual: {{ topic }}</h5>
  </div>
</template>

<script>
export default {
  name: "simple",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value: 0,
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
          //this.getData();
        }, 300);
      }
    }
  },

  mounted() {
    this.getNow();
    this.getData();
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
    getData() {
      const axiosHeaders = {
        headers: {
          token: $nuxt.$store.state.auth.token
        },
        params: {
          dId: this.config.selectedDevice.dId,
          variable: this.config.variable
        }
      };
      this.$axios
        .get("/get-last-data", axiosHeaders)
        .then(res => {
          const data = res.data.data;
          data.forEach(element => {
            this.value = element.value;
            console.log("valur ", this.value);
          });
          return;
        })
        .catch(e => {
          console.log(e);
          return;
        });
    },
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
