<template>
  <div style="padding: 10px">
    <v-tabs-items v-model="tabActivo">
      <v-tab-item value="sistema">
        <sistema :basic-types="basicTypes"
          :datastreams="datastreams"
          :model="model"/>
      </v-tab-item>
      <v-tab-item value="sensores">
        <sensores
          :basic-types="basicTypes"
          :datastreams="datastreams"
          :model="model"
        />
      </v-tab-item>
      <v-tab-item value="configuracion">
        <configuracion />
      </v-tab-item>
      <v-tab-item value="mapas">
        <mapas :model="model"/>
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
    
  },
  data() {
    return {
      tabActivo: "sistema",
      drawer: false,
      group: null,
      deviceData: null,
      basicTypes: null,
      datastreams: null,
      model : {}
      
    };
  },
  mounted() {
    console.log("device id: " + this.deviceId);
    console.log("device org: " + this.deviceOrganization);
    
    this.findDevice();
   
      
  },

  methods: {
    ...mapMutations({
      setTab: "appbar/setTab",

    }),
    async findDevice() {
      // consulta de datos de dispositivo
      const data = await this.$api
        .newDeviceFinder()
        .findByOrganizationAndId(this.deviceOrganization, this.deviceId, true);
      this.model = data.data
      console.log(data);
      
     
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
    }
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
