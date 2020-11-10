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
  name: 'sistema',
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
    },
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        if (newVal) {          
          this.innerModel = { ...newVal }
        } else {
          this.innerModel = {}
        }
      },
      deep: true
    }
  },
  data() {
    return {
      valid: false,
      options: {},
      innerModel: this.model?{...this.model}:{}
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
          .withDataStreamVersion("" + new Date().getTime())
        
        // Se pasan los datos del modelo al builder
        for(const prop in this.innerModel){
          console.log(this.model[prop])
          console.log(this.innerModel[prop])
          if (this.innerModel[prop]!=null) {
            let datapointsBuilder = this.$api.datapointsBuilder().withValue(this.innerModel[prop])
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop)
            mb.withDataStream(datastreamBuilder.withDatapoint(datapointsBuilder))
          }
        }

        // se pasa el id del dispositivo a actualizar
        mb.withId(this.innerModel["device.identifier"])

        // se lanza la petición
        const result = await mb.create()

      } catch (errorApi) {
        console.error(errorApi);
      }
    },
  },
};
</script>