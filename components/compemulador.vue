<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar extended color="primary" dark>
        <!-- <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
          ></v-img>
        </template> -->
        <v-app-bar-nav-icon class="ma-2" @click="routerlister">
          <v-icon> mdi-arrow-left </v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title class="tittle"
          >Device {{ deviceId }} - Device Emulator</v-toolbar-title
        >

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>

        <template v-slot:extension>
          <div class="menu">
            <v-menu offset-y align-with-title>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">
                  Emulation
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title @click="tabActivo = 'sistema'"
                    >System</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="tabActivo = 'sensores'"
                    >Sensors</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="tabActivo = 'configuracion'"
                    >Operations</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="tabActivo = 'mapas'"
                    >Map</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-tabs align-with-title class="nav_item" v-model="tabActivo">
            <v-tab href="#sistema">System</v-tab>
            <v-tab href="#sensores">Sensors</v-tab>
            <v-tab href="#configuracion">Operations</v-tab>
            <v-tab href="#mapas">Map</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>
      <v-card>
        <v-card-text>
          <v-tabs-items v-model="tabActivo">
            <v-tab-item value="sistema">
              <sistema :system-schema="systemSchema"/>
            </v-tab-item>
            <v-tab-item value="sensores">
              <sensores :sensors-schema="sensorsSchema" />
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
    </v-app>
  </div>
</template>

<script>
import sistema from "@/components/sistema";
import sensores from "@/components/sensores";
import configuracion from "@/components/configuracion";
import mapas from "@/components/mapas";
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  mixins: [baseUserApiMixin],
  components: {
    sistema,
    sensores,
    configuracion,
    mapas,
  },
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
            !dsTmp.identifier.includes("communicationModules[]")
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
          if (
            dsTmp.identifier == "device.identifier" ||
            dsTmp.identifier == "device.specificType" ||
            dsTmp.identifier == "device.name" ||
            dsTmp.identifier == "device.description" ||
            dsTmp.identifier == "device.birthDate" ||
            dsTmp.identifier == "device.serialNumber" ||
            dsTmp.identifier == "device.model" ||
            dsTmp.identifier == "device.software" ||
            dsTmp.identifier == "device.operationalStatus" ||
            dsTmp.identifier == "device.administrativeState" ||
            dsTmp.identifier == "device.topology.path"  ||         
            dsTmp.identifier == "device.trustedBoot"           ) {
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
  },
  data() {
    return {
      tabActivo: "sistema",
      deviceData: null,
      basicTypes: null,
      datastreams: null,
    };
  },
  mounted() {
    console.log("device id: " + this.deviceId);
    console.log("device org: " + this.deviceOrganization);

    this.findDevice();
  },
  methods: {
    async findDevice() {
      // consulta de datos de dispositivo
      const data = await this.$api
        .newDeviceFinder()
        .findByOrganizationAndId(this.deviceOrganization, this.deviceId, true);
      console.log(data);

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
    routerlister(id) {
      this.$router.push({
        path: "/listerpage",
      });
    },
     
    
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
