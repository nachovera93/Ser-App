<template>
  <div class="simple-widget">
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
          >{{ Number(this.value2).toFixed(config.decimalPlaces) }} -
          {{ config.unit }}</span
        >
      </b-card-text>
      <h6 class="card-category mt-2">
        Last updated {{ getTimeAgo((nowTime - time) / 1000) }} ago
      </h6>
    </b-card>
    <!-- <h5>{{ this.config }}</h5> -->
    <!-- <h5>Tópico actual: {{ topic }}</h5> -->
    <!-- <h5>{{ this.value2 }}</h5> -->

  </div>
</template>

<script>
export default {
  name: "simple",
  props: ["config"],
  data() {
    return {
      receivedTime: 0,
      value2:0,
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
          //this.value = 0;
          console.log("LLEGO!!");
          this.$nuxt.$off(this.topic + "/sdata");
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/" +
            this.config.type;
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
        this.value2 = data.value;
      } catch (error) {
        console.log(error);
      }
    },
    async getData() {
      try {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token
          },
          params: {
            dId: this.config.selectedDevice.dId,
            variable: this.config.variable
          }
        };
        const res = await this.$axios.get("/get-last-data", axiosHeaders);
        const data = res.data.data;
        this.value2=data[0];
        //data.forEach(element => {
        //  this.value = element.variableData;
        //  this.value2 = element.variableData;
        //  console.log("valur ", this.value);
        //});
      } catch (e) {
        console.log(e);
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


<style scoped>
  .simple-widget {
    margin-top: 2rem;
  }
</style>
