<template>
  <div>
    <!-- FORM ADD DEVICE -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Add new Device</h4>
        </div>

        <div class="row">
          <div class="col-4">
            <base-input
              label="Device Name"
              type="text"
              placeholder="Ex: Home, Office..."
              v-model="newDevice.name"
            >
            </base-input>
          </div>

          <div class="col-4">
            <base-input
              label="Device Id"
              type="text"
              placeholder="Ex: 7777-8888"
              v-model="newDevice.dId"
            >
            </base-input>
          </div>

          <div class="col-4">
            <slot name="label">
              <label> Template </label>
            </slot>

            <el-select
              v-model="selectedIndexTemplate"
              placeholder="Select Template"
              class="select-primary"
              style="width: 100%"
            >
              <el-option
                v-for="(template, index) in templates"
                :key="template._id"
                class="text-dark"
                :value="index"
                :label="template.name"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="createNewDevice()"
              type="primary"
              class="mb-3"
              size="lg"
              >Add</base-button
            >
          </div>
        </div>
      </card>
    </div>

    <!-- DEVICES TABLE -->
    <div class="row">
      <b-card class="my-3">
        <div slot="header">
          <h4 class="card-title">Devices</h4>
        </div>
        <b-table
          striped
          hover
          :items="devices"
          :fields="deviceFields"
          class="my-4"
        >
          <!-- Index of device -->
          <template v-slot:cell(index)="{ index }">
            {{ index + 1 }}
          </template>

          <!-- Device Name -->
          <template v-slot:cell(name)="{ item }">
            {{ item.name }}
          </template>

          <!-- Template Name -->
          <template v-slot:cell(templateName)="{ item }">
            {{ item.templateName }}
          </template>

          <template v-slot:cell(dId)="{ item }">
            {{ item.dId }}
          </template>

          <!-- Password -->
          <template v-slot:cell(password)="{ item }">
            {{ item.password }}
          </template>

          <!-- Rule Engine Switch -->
          <template v-slot:cell(ruleEngine)="data">
            <base-switch
              v-if="data.item.saverRule"
              :value="data.item.saverRule.status"
              @click.native="updateSaverRuleStatus(data.item)"
              type="primary"
              on-text="On"
              off-text="Off"
            ></base-switch>
          </template>

          <!-- Delete Button -->
          <template v-slot:cell(actions)="{ item }">
            <b-button size="sm" variant="danger" @click="deleteDevice(item)">
              <i class="tim-icons icon-simple-remove"></i>
            </b-button>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";
export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      deviceFields: [
        { key: "index", label: "#", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "dId", label: "dId", sortable: true }, // Agregar columna de Device ID
        { key: "password", label: "Password", sortable: true }, // Agregar columna de Password
        { key: "templateName", label: "Template", sortable: true },
        { key: "ruleEngine", label: "Rule Engine" },
        { key: "actions", label: "Actions" },
      ],
      templates: [],
      devices: [],
      selectedIndexTemplate: null,
      newDevice: {
        name: "",
        dId: "",
        templateId: "",
        templateName: "",
      },
    };
  },
  mounted() {
    this.getTemplates();
    this.getDevices();
  },
  methods: {
    updateSaverRuleStatus(device) {
      if (!device.saverRule) {
        console.error("Saver rule is not defined for device", device);
        // Notificar al usuario que la regla no existe
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Saver rule not defined for this device.",
        });
        return;
      }

      // Hacer una copia de la regla para actualizar su estado
      var ruleCopy = JSON.parse(JSON.stringify(device.saverRule));
      ruleCopy.status = !ruleCopy.status; // Cambiar el estado

      const toSend = {
        rule: ruleCopy,
      };
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };

      this.$axios
        .put("/saver-rule", toSend, axiosHeaders)
        .then((res) => {
          if (res.data.status === "success") {
            this.$store.dispatch("getDevices");
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Device Saver Status Updated",
            });
          } else {
            // Manejar casos donde la respuesta no es de éxito
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Failed to update saver rule status.",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error updating saver rule status",
          });
        });
    },

    deleteDevice(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.accessToken,
        },
        params: {
          dId: device.dId,
        },
      };
      this.$axios
        .delete("/device", axiosHeaders)
        .then((res) => {
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: device.name + " deleted!",
            });
          }
          $nuxt.$emit("time-to-get-devices");
          return;
        })
        .catch((e) => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + device.name,
          });
          return;
        });
    },
    //new device
    createNewDevice() {
      if (this.newDevice.name === "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Device Name is Empty :(",
        });
        return;
      }
      if (this.newDevice.dId === "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Device ID is Empty :(",
        });
        return;
      }
      if (this.selectedIndexTemplate === null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Template must be selected",
        });
        return;
      }

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      this.newDevice.templateId =
        this.templates[this.selectedIndexTemplate]._id;
      this.newDevice.templateName =
        this.templates[this.selectedIndexTemplate].name;

      const toSend = {
        newDevice: this.newDevice,
      };

      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then((res) => {
          if (
            res.data.status === "success" ||
            res.data.status === "partial_success"
          ) {
            this.getDevices(); // Actualizar la lista de dispositivos
            this.resetNewDeviceForm(); // Limpiar el formulario
            let message = "Device created successfully.";
            if (res.data.status === "partial_success") {
              message +=
                " However, there was an issue creating the saver rule.";
            }
            this.$notify({
              type: res.data.status === "success" ? "success" : "warning",
              icon: "tim-icons icon-check-2",
              message: message,
            });
          } else {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                res.data.error || "Error creating device. Please try again.",
            });
          }
        })
        .catch((error) => {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error creating device. Please try again.",
          });
        });
    },
    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        console.log(res.data);
        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates...",
        });
        console.log(error);
        return;
      }
    },
    getDevices() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token, // Asegúrate de usar el token correcto
        },
      };

      this.$axios
        .get("/device", axiosHeaders)
        .then((res) => {
          if (res.data.status === "success") {
            // Actualiza el estado de devices con los datos recién obtenidos
            this.devices = res.data.data.map((device) => ({
              ...device,
              saverRule: device.saverRule || { status: false },
            }));
          } else {
            // Manejar caso en que la respuesta no sea de éxito
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Failed to fetch devices.",
            });
          }
        })
        .catch((error) => {
          // Manejar errores de llamada API
          console.error("Error fetching devices:", error);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Error fetching devices. Please try again.",
          });
        });
    },

    deleteDevice(deviceToDelete) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
        params: {
          dId: deviceToDelete.dId,
        },
      };

      this.$axios
        .delete("/device", axiosHeaders)
        .then((res) => {
          if (res.data.status === "success") {
            // Eliminar el dispositivo de la lista local sin necesidad de recargar desde el servidor
            this.devices = this.devices.filter(
              (device) => device.dId !== deviceToDelete.dId
            );

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: `${deviceToDelete.name} deleted!`,
            });
          } else {
            // Manejar casos donde la respuesta no es de éxito
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: `Error deleting ${deviceToDelete.name}. Please try again.`,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: `Error deleting ${deviceToDelete.name}. Please try again.`,
          });
        });
    },

    resetNewDeviceForm() {
      this.newDevice.name = "";
      this.newDevice.dId = "";
      this.selectedIndexTemplate = null;
    },
    handlePartialSuccess(data) {
      this.$store.dispatch("getDevices");
      let message = "Device created successfully.";
      if (!data.saverRuleCreated) {
        message += " However, there was an error creating the saver rule.";
      }
      this.$notify({
        type: "warning",
        icon: "tim-icons icon-alert-circle-exc",
        message: message,
      });
    },
  },
};
</script>
