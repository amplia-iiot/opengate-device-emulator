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
     basicTypes: {
      type: Object,
      default: () => null,
    },
    datastreams: {
      type: Array,
      default: () => []
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
      innerModel: this.model?{...this.model}:{},
      systemDatastreams: [
        "device.identifier",
        "device.specificType",
        "device.name",
        "device.description",
        "device.serialNumber",
        "device.operationalStatus",
        "device.administrativeState",
      ],
      finalSystemSchema:[],
      model : {}
    };
  },
  methods: {
      deviceId() {
      return this.$route.query.id;
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
    systemSchemaMethod(){
      this.finalSystemSchema = []
      this.model = {}
      this.systemDatastreams.forEach((element)=>{
        
          this.finalSystemSchema.push(element)
        
      })
    }
  },
  computed:{
    systemSchema() {
      if (this.basicTypes && this.datastreams && this.datastreams.length > 0) {
        const finalSchema = {
          type: "object",
          properties: {},
          definitions: this.basicTypes.definitions,
        };

        this.datastreams.forEach((dsTmp) => {
         
            if(this.finalSystemSchema.includes(dsTmp.identifier)) {
              finalSchema.properties[dsTmp.identifier] = dsTmp.schema
              }
          
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
  mounted(){
    this.systemSchemaMethod()
  }
};
</script>