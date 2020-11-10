<template>
  <v-app>
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
  </v-app>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  mixins: [baseUserApiMixin],
  components: {
    VJsf,
  },
  props: {
    // model: {
    //   type: Object,
    //   default: () => null,
    // },
    basicTypes: {
      type: Object,
      default: () => null,
    },
    datastreams: {
      type: Array,
      default: () => []
    }
    /*     listaPrueba: {
      type: Array,
    }, */
  },
  computed: {
    deviceId() {
      return this.$route.query.id;
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
        "device.temperature.value"
      ]  
    },
    sensorsSchema() {
      if (this.basicTypes && this.datastreams && this.datastreams.length > 0 && this.selectedSensors && this.selectedSensors.length > 0) {
        const finalSchema = {
          type: "object",
          properties: {},
          definitions: this.basicTypes.definitions,
        }

        const finalDatastreams = this.datastreams.filter((dsTmp) => {
          return this.selectedSensors.includes(dsTmp.identifier)
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
    // model: {
    //   handler(newVal, oldVal) {
    //     if (newVal)
    //     this.innerModel = newVal;
    //   },
    // },
  },
  data() {
    return {
      valid: false,
      readOnly: true,
      selectedSensors: [],
      options: {},
      innerModel: {},
      only: true,
      disabled1: false,
      disabled2: true,
    };
  },

  methods: {
    sendInfo() {
      this.sendInfoApi();
    },
    async sendInfoApi() {
      try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime())
        
        // Se pasan los datos del modelo al builder
        for(const prop in this.innerModel){
          console.log(this.innerModel[prop])
          if (this.innerModel[prop]!=null) {
            let datapointsBuilder = this.$api.datapointsBuilder().withValue(this.innerModel[prop])
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop)
            mb.withDataStream(datastreamBuilder.withDatapoint(datapointsBuilder))
          }
        }

        // se pasa el id del dispositivo a actualizar
        mb.withId(this.deviceId)

        // se lanza la petición
        const result = await mb.create()

      } catch (errorApi) {
        console.error(errorApi);
      }
    },


/* deleteChip, elimina las chips creadas */


/*     botonEditar: function () {
      (this.schema.properties.temperatura.readOnly = false),
        (this.schema.properties.ram.readOnly = false),
        (this.schema.properties.hdd.readOnly = false),
        (this.schema.properties.bateria.readOnly = false),
        (this.disabled2 = false),
        (this.disabled1 = true);
    },
    botonCambiar: function () {
      (this.disabled2 = true),
        (this.disabled1 = false),
        (this.schema.properties.temperatura.readOnly = true),
        (this.schema.properties.ram.readOnly = true),
        (this.schema.properties.hdd.readOnly = true),
        (this.schema.properties.bateria.readOnly = true);
    }, */
  },
};
</script>