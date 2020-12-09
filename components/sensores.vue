<template>
  <div>
    <div style="display:inline">
<<<<<<< HEAD
        <v-row style="width:30%; margin:0">
=======
      <v-row style="width:30%; margin:0">
>>>>>>> 1efec751d526ed3d9beab4cd0667942349cbb1f0
          <v-checkbox
            right
            @click="switchMe = !switchMe"
            v-on:click="stopAndPlay"
            inset
          >
<<<<<<< HEAD
            <template v-slot:prepend>
                <v-text-field
                :disabled="!switchMe" 
                @keyup.enter="autoSend"
                v-model="contSend"
                color="cyan darken"
                label="Envio automatico"
                dense
                rounded
              >
              </v-text-field>      
            </template>
          </v-checkbox>   
        </v-row>
=======
           <template v-slot:prepend>
             <v-text-field
            :disabled="!switchMe" 
            @keyup.enter="autoSend"
            v-model="contSend"
            color="cyan darken"
            label="Envio automatico"
            dense
            rounded
          >
          </v-text-field>      
          </template>
          </v-checkbox>   
      </v-row>
>>>>>>> 1efec751d526ed3d9beab4cd0667942349cbb1f0
    </div>

    <v-btn
      @click="sendInfo"
      :disabled="change"
      fab
      fixed
      bottom
      right
      color="accet"
    >
      <v-icon> mdi-send </v-icon>
    </v-btn>
    <!-- <v-btn
      @click="switchMe = !switchMe"
      fab
      fixed
      bottom
      right
      color="accet"
      style="margin-bottom:8%"
    >
      <v-icon> mdi-clock-end </v-icon>
    </v-btn> -->

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
  name: "sensores",
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
        };

        const finalDatastreams = this.datastreams.filter((dsTmp) => {
          return this.selectedSensors.includes(dsTmp.identifier);
        });

        finalDatastreams.forEach((dsTmp) => {
          finalSchema.properties[dsTmp.identifier] = dsTmp.schema;
        });

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
        this.mapModelInfo(newVal);
      },
      deep: true,
    },
  },
  data() {
    return {
      autoSendVar: "",
      contSend: 100, // 1000 = 1 second
      switchMe: false,
      change: false,
      valid: false,
      selectedSensors: [],
      options: {},
      innerModel: {},
    };
  },
  mounted() {
    this.mapModelInfo(this.model);
  },
  destroyed() {
    if (this.switchMe) {
      clearInterval(this.autoSendVar);
    }
  },
  methods: {
    stopAndPlay() {
      if (this.switchMe === true) {
        this.autoSend()
        this.only = false
      } else {
        clearInterval(this.autoSendVar);
      }
    },
    autoSend() {
      if (this.contSend) {
        clearInterval(this.autoSendVar);
      }
      let contSendVar = 1000 * this.contSend;
      this.autoSendVar = setInterval(this.sendInfo, contSendVar);
    },

    mapModelInfo(modelData) {
      this.innerModel = {}
      if (modelData) {
        this.selectedSensors = []
        this.arrSensors.forEach((element) => {
          if (modelData[element]) {
            this.innerModel[element] = modelData[element]._value._current.value;
            this.selectedSensors.push(element)
          } else if (modelData["provision." + element]) {
            this.innerModel[element] =
              modelData["provision." + element]._value._current.value;
            this.selectedSensors.push(element)
          }
        });
      }
    },
    sendInfo() {
      this.sendInfoApi()
    },
    async sendInfoApi() {
      try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime())

        // Se pasan los datos del modelo al builder
        for (const prop in this.innerModel) {
          console.log(this.innerModel[prop])
          if (this.innerModel[prop] != null) {
            let datapointsBuilder = this.$api
              .datapointsBuilder()
              .withValue(this.innerModel[prop])
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop);
            mb.withDataStream(
              datastreamBuilder.withDatapoint(datapointsBuilder)
            );
          }
        }

        // se pasa el id del dispositivo a actualizar
        mb.withId(this.deviceId)

        // se lanza la petición
        const result = await mb.create()
      } catch (errorApi) {
        console.error(errorApi)
      }
    },
  },
};
</script>
<style scoped>
.switch {

flex: unset;

}
</style>
