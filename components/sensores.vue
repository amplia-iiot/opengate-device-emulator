<template>
  <div>
    <v-btn
      @click="sendInfo"
      :disabled="!valid"
      fab
      fixed
      bottom
      right
      color="accent"
    >
      <v-icon> mdi-send </v-icon>
    </v-btn>

    <v-form ref="form" v-model="valid">
      <v-autocomplete
        v-model="selectedSensors"
        multiple
        :items="arrSensors"
        label="sensors"
        chips
        deletable-chips
      />

      <v-jsf
        v-if="sensorsSchema"
        v-model="innerModel"
        :schema="sensorsSchema"
        :options="options"
      />
    </v-form>
  </div>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  name: 'sensores',
  mixins: [baseUserApiMixin],
  components: {
    VJsf,
  },
  props: {
    model: {
      type: Object,
      default: () => null,
    },
    basicTypes: {
      type: Object,
      default: () => null,
    },
    datastreams: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    deviceId() {
      return this.$route.query.id
    },
    arrSensors() {
      return [
        "device.clock",
        "device.cpu.status",
        "device.cpu.total",
        "device.cpu.usage",
        "device.powersupply.battery.charge",
        "device.powersupply.battery.current",
        "device.powersupply.battery.status",
        "device.powersupply.battery.voltage",
        "device.powersupply.outage",
        "device.powersupplname: 'sistema',sk.total",
        "device.storage.disk.usage",
        "device.storage.ramDisk.total",
        "device.storage.ramDisk.usage",
        "device.temperature.status",
        "device.temperature.value",
      ];
    },
    sensorsSchema() {
      if (
        this.basicTypes &&
        this.datastreams &&
        this.datastreams.length > 0 &&
        this.selectedSensors &&
        this.selectedSensors.length > 0
      ) {
        const finalSchema = {
          type: "object",
          properties: {},
          definitions: this.basicTypes.definitions,
        }

        const finalDatastreams = this.datastreams.filter((dsTmp) => {
          return this.selectedSensors.includes(dsTmp.identifier);
        })

        finalDatastreams.forEach((dsTmp) => {
          finalSchema.properties[dsTmp.identifier] = dsTmp.schema;
        })

        console.log(finalSchema);

        return finalSchema;
      } else {
        return {
          type: "object",
          properties: {},
        };
      }
    },
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.finalSensorsSchema = []
          this.arrSensors.forEach((element) => {
            if (this.model[element]) {
              this.innerModel[element] = this.model[
                element
              ]._value._current.value
              this.finalSensorsSchema.push(element);
            } else if (this.model["provision." + element]) {
              this.innerModel[element] = this.model[
                "provision." + element
              ]._value._current.value
              this.finalSensorsSchema.push(element)
            } else {
              this.finalSensorsSchema.push(element)
            }
          })
        } else {
          this.innerModel = {}
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      valid: false,
      readOnly: true,
      selectedSensors: [],
      options: {},
      innerModel: this.model?{...this.model}:{},
      only: true,
      finalSensorsSchema: [],
    };
  },

  methods: {
    sendInfo() {
      this.sendInfoApi()
    },
    async sendInfoApi() {
      try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime());

        // Se pasan los datos del modelo al builder
        for (const prop in this.innerModel) {
          console.log(this.innerModel[prop]);
          if (this.innerModel[prop] != null) {
            let datapointsBuilder = this.$api
              .datapointsBuilder()
              .withValue(this.innerModel[prop]);
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop);
            mb.withDataStream(
              datastreamBuilder.withDatapoint(datapointsBuilder)
            )
          }
        }

        // se pasa el id del dispositivo a actualizar
        mb.withId(this.deviceId);

        // se lanza la petición
        const result = await mb.create();
      } catch (errorApi) {
        console.error(errorApi);
      }
    },
  },
};
</script>
