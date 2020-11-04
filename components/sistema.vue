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
    <v-form v-model="valid">
      <v-jsf
        v-if="systemSchema"
        v-model="innerModel"
        :schema="systemSchema"
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
  components: {
    VJsf,
  },
  mixins: [baseUserApiMixin],
  props: {
    systemSchema: {
      type: Object,
      default: () => null,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        this.innerModel = newVal;
      },
    },
  },
  data() {
    return {
      valid: false,
      options: {},
      innerModel: this.model,
    };
  },
  methods: {
    async sendInfo() {
      try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime());
        for(const prop in this.innerModel){
          console.log(this.model[prop])
          console.log(this.innerModel[prop])
          if (this.innerModel[prop]!=null) {
            let datapointsBuilder = this.$api.datapointsBuilder().withValue(this.innerModel[prop]);
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop);
            mb.withId(this.innerModel["device.identifier"]).withDataStream(datastreamBuilder.withDatapoint(datapointsBuilder));
             const result = await mb.create();
          }
        };
        

        // Esto hay que hacerlo por cada uno de los elementos del modelo
      } catch (errorApi) {
        console.error(errorApi);
      }
    },
  },
};
</script>