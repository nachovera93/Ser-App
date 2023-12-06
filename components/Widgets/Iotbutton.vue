<template>
  <div :class="[config.column]">
    <b-card>
      >
      <b-form-checkbox v-model="isCheckboxChecked" size="sm"></b-form-checkbox>
      <div slot="header">
        <h4 class="card-title">
          {{ config.NameWidget }}
        </h4>
      </div>

      <i
        class="fa"
        :class="[config.icon, getIconColorClass()]"
        style="font-size: 30px"
      ></i>

      <base-button
        @click="sendValue()"
        :type="config.class"
        class="mb-3 pull-right"
        size="lg"
        >{{ config.text }}</base-button
      >

      <h5 v-if="isCheckboxChecked" class="title-text">
        Tópico actual: {{ topic + "/sdata" }}
        <!-- {{ config }} -->
      </h5>
    </b-card>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ["config"],
  data() {
    return {
      sending: false,
      isCheckboxChecked: false,
    };
  },
  watch: {
    config: {
      immediate: true,
      deep: true,
      handler() {
        setTimeout(() => {
          this.topic =
            this.config.userId +
            "/" +
            this.config.selectedDevice.dId +
            "/" +
            this.config.variable +
            "/actdata";
        }, 300);
      },
    },
  },
  mounted() {},
  methods: {
    sendValue() {
      this.sending = true;

      setTimeout(() => {
        this.sending = false;
      }, 500);

      const toSend = {
        topic:
          this.config.userId +
          "/" +
          this.config.selectedDevice.dId +
          "/" +
          this.config.variable +
          "/actdata",
        msg: {
          value: this.config.message,
        },
      };

      console.log(toSend);
      this.$nuxt.$emit("mqtt-sender", toSend);
    },

    getIconColorClass() {
      if (!this.sending) {
        return "text-dark";
      }

      if (this.config.class == "success") {
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
    },
  },
};
</script>
