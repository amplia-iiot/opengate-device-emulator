<template>
  <div>
      <v-card>
        <v-card-text>
          <v-tabs-items v-model="tabActivo">
            <v-tab-item value="sistema">
              <sistema :system-schema="systemSchema" :model="model" />
            </v-tab-item>
            <v-tab-item value="sensores">
              <sensores
                :sensors-schema="sensorsSchema"
                :arr-sensors= "sensors_"
                :lista-prueba="sensorsSchema.properties"
              />
            </v-tab-item>
            <v-tab-item value="configuracion">
              <configuracion />
            </v-tab-item>
            <v-tab-item value="mapas">
              <mapas />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
      </div>
</template>

<script>
import sistema from "@/components/sistema";
import sensores from "@/components/sensores";
import configuracion from "@/components/configuracion";
import mapas from "@/components/mapas";
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";
import { mapMutations } from "vuex";


export default {
  components: {
    sistema,
    sensores,
    configuracion,
    mapas,
  },
  mixins: [baseUserApiMixin],
  computed: {
    deviceId() {
      return this.$route.query.id;
    },
    deviceOrganization() {
      return this.$route.query.organization;
    },
    sensorsSchema() {
      if (this.basicTypes && this.datastreams && this.datastreams.length > 0) {
        const finalSchema = {
          type: "object",
          properties: {},
          definitions: this.basicTypes.definitions,
        };

        this.datastreams.forEach((dsTmp) => {
          if (
            !dsTmp.identifier.startsWith("provision.") &&
            !dsTmp.identifier.includes("communicationModules[]") &&
            dsTmp.identifier != "device.identifier" &&
            dsTmp.identifier != "device.identification" &&
            dsTmp.identifier != "entity.areas" &&
            dsTmp.identifier != "entity.location" &&
            dsTmp.identifier != "device.specificType" &&
            dsTmp.identifier != "device.name" &&
            dsTmp.identifier != "device.description" &&
            dsTmp.identifier != "device.birthDate" &&
            dsTmp.identifier != "device.serialNumber" &&
            dsTmp.identifier != "device.model" &&
            dsTmp.identifier != "device.software" &&
            dsTmp.identifier != "device.operationalStatus" &&
            dsTmp.identifier != "device.administrativeState" &&
            dsTmp.identifier != "device.topology.path" &&
            dsTmp.identifier != "device.trustedBoot"
          ) {
            finalSchema.properties[dsTmp.identifier] = dsTmp.schema;
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
    systemSchema() {
      if (this.basicTypes && this.datastreams && this.datastreams.length > 0) {
        const finalSchema = {
          type: "object",
          properties: {},
          definitions: this.basicTypes.definitions,
        };

        this.datastreams.forEach((dsTmp) => {
         
            if(this.finalSistemSchema.includes(dsTmp.identifier)) {
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
      model: {type:Object,
      tab: this.$store.state.appbar.tabActivo,
      properties:{} },
      sistemSchema: [
        "device.identifier",
        "device.specificType",
        "device.name",
        "device.description",
        "device.serialNumber",
        "device.operationalStatus",
        "device.administrativeState",
      ],
      finalSistemSchema:[],
      sensors_: [
        "device.clock",
        "device.cpu.status",
        "device.cpu.total",
        "device.cpu.usage",
        "device.powersupply.battery.charge",
        "device.powersupply.battery.current",
        "device.powersupply.battery.status",
        "device.powersupply.battery.voltage",
        "device.powersupply.outage",
        "device.powersupply.source",
        "device.powersupply.status",
        "device.ram.total",
        "device.ram.usage",
        "device.sessionType",
        "device.storage.disk.total",
        "device.storage.disk.usage",
        "device.storage.ramDisk.total",
        "device.storage.ramDisk.usage",
        "device.temperature.status",
        "device.temperature.value"
      ],    
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
    }),
    async findDevice() {
      // consulta de datos de dispositivo
      const data = await this.$api
        .newDeviceFinder()
        .findByOrganizationAndId(this.deviceOrganization, this.deviceId, true);
      
      console.log(data);
      this.finalSistemSchema = []
      
      this.sistemSchema.forEach((element)=>{
        if(data.data[element]){
          this.model[element] = data.data[element]._value._current.value
          this.finalSistemSchema.push(element)
        } else if(data.data["provision."+element]){
          this.model[element] = data.data["provision."+element]._value._current.value
          this.finalSistemSchema.push(element)
        } else {
          this.finalSistemSchema.push(element)
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
      getDrawer: function(){
        this.drawer = this.getDrawer
      }
    },
    
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
