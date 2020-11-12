<template>
  <div style="padding: 10px">
    <v-tabs-items v-model="tabActivo">
      <v-tab-item value="sistema">
        <sistema :system-schema="systemSchema" :model="model" />
      </v-tab-item>
      <v-tab-item value="sensores">
        <sensores
          :basic-types="basicTypes"
          :datastreams="datastreams"
        />
      </v-tab-item>
      <v-tab-item value="configuracion">
        <configuracion />
      </v-tab-item>
      <v-tab-item value="mapas">
        <mapas />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import sistema from "@/components/sistema";
import sensores from "@/components/sensores";
import configuracion from "@/components/configuracion";
import mapas from "@/components/mapas";
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";
import { mapMutations } from "vuex";
import textField from '@/mixins/textField.mixin.js'


export default {
  components: {
    sistema,
    sensores,
    configuracion,
    mapas,
  },
  mixins: [baseUserApiMixin,textField],
  computed: {
    deviceId() {
      return this.$route.query.id;
    },
    deviceOrganization() {
      return this.$route.query.organization;
    },
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
  data() {
    return {
      tabActivo: "sistema",
      drawer: false,
      group: null,
      deviceData: null,
      basicTypes: null,
      datastreams: null,
      model: {},
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
      
    };
  },
  mounted() {
    console.log("device id: " + this.deviceId);
    console.log("device org: " + this.deviceOrganization);
    
    this.findDevice();
   
      this.setPage({
      page: "emulador"
    })
  },

  methods: {
    ...mapMutations({
      setPage: "appbar/setPage",
      setTab: "appbar/setTab",

    }),
    async findDevice() {
      // consulta de datos de dispositivo
      const data = await this.$api
        .newDeviceFinder()
        .findByOrganizationAndId(this.deviceOrganization, this.deviceId, true);
      
      console.log(data);
      this.finalSystemSchema = []
      this.model = {}
      this.systemDatastreams.forEach((element)=>{
        if(data.data[element]){
          this.model[element] = data.data[element]._value._current.value
          this.finalSystemSchema.push(element)
        } else if(data.data["provision."+element]){
          this.model[element] = data.data["provision."+element]._value._current.value
          this.finalSystemSchema.push(element)
        } else {
          this.finalSystemSchema.push(element)
        }
      })
     
      console.log(this.models)
      
      // consulta de tipos disponibles en datastreams
      const basicTypes = await this.$api
        .basicTypesSearchBuilder()
        .build()
        .execute();

      console.log(basicTypes);

      this.basicTypes = basicTypes.data;

      // Consulta de datamodels disponibles para la organización del dispositivo
      const datamodels = await this.$api
        .datamodelsSearchBuilder()
        .filter({
          and: [
            {
              in: {
                "datamodels.allowedResourceTypes": ["entity.device"],
              },
            },
            {
              eq: {
                "datamodels.organizationName": this.deviceOrganization,
              },
            },
          ],
        })
        .build()
        .execute();

      console.log(datamodels);

      // Se extrae los datastremas
      const finalDatastreams = [];

      datamodels.data.datamodels.forEach((datamodelTmp) => {
        datamodelTmp.categories.forEach((catTmp) => {
          catTmp.datastreams.forEach((dsTmp) => {
            if (dsTmp.schema && dsTmp.schema.$ref) {
              dsTmp.schema.$ref = dsTmp.schema.$ref.replace(
                "og_basic_types.json",
                ""
              );
            }

            finalDatastreams.push(dsTmp);
          });
        });
      });

      console.log(finalDatastreams);
      this.datastreams = finalDatastreams;
    },
    
    

    
  },
  watch: {
    tab: function(){
      this.tabActivo = this.tab
    },
     tabActivo: function () {
      this.setTab({
         tab: this.tabActivo,
      });
    },
  
  }
};
</script>

<style scoped>
.menu,
.mobile {
  display: none;
}

@media only screen and (max-width: 768px) {
  .nav_item,
  .tittle {
    display: none;
  }

  .menu,
  .mobile {
    display: block;
  }
}
</style>
