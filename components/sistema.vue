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
      <v-icon>
        mdi-send
      </v-icon>
    </v-btn>
    <v-form v-model="valid">
      <v-jsf v-if="systemSchema" v-model="innerModel" :schema="systemSchema" :options="options" />
    </v-form>
  </div>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  components: {
    VJsf,
  },
  mixins: [baseUserApiMixin],
  props: {
    systemSchema: {
      type: Object,
      default: () => null
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        this.innerModel = newVal
      }
    }
  },
  data() {
    return {
      valid: false,
      options: {},
      innerModel: this.model
    };
  },
  methods: {
    async sendInfo() {
      try {
        datastreamBuilder.withDatapoint(datapointsBuilder);
        
        let mb = this.$api.deviceMessageBuilder().withDataStreamVersion('' + (new Date().getTime()))

        // Esto hay que hacerlo por cada uno de los elementos del modelo
        let datapointsBuilder = this.$api.datapointsBuilder().withValue(this.innerModel['device.name']);
        let datastreamBuilder = this.$api.datastreamBuilder().withId('device.name')
        mb.withId(this.innerModel['device.identifier']).withDataStream(datastreamBuilder)

        const result = await mb.create()
      } catch(errorApi) {
        console.error(errorApi)
      }
      
    }
  },
};
</script>