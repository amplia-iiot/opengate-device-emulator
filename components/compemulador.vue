<template>
  <div id="app">
    <v-app id="inspire">
      <v-app-bar
        extended
        color="primary"
        dark
      >
        <!-- <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
          ></v-img>
        </template> -->
        <v-app-bar-nav-icon
          class="ma-2"
          @click="routerlister"
        >
          <v-icon> mdi-arrow-left </v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title class="tittle">Device {{ id }} - Device Emulator</v-toolbar-title>

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
                <v-list-item-title @click="tabActivo='sistema'">System</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="tabActivo='sensores'"
                  >Sensors</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="tabActivo='configuracion'"
                  >Operations</v-list-item-title
                >
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="tabActivo='mapas'">Map</v-list-item-title>
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
              <sistema />
            </v-tab-item>
            <v-tab-item value="sensores">
              <sensores />
              </v-tab-item>
            <v-tab-item value="configuracion">
              <configuracion />
            </v-tab-item>
            <v-tab-item value="mapas">
              <mapas/>
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
export default {
  components: {
    sistema,
    sensores,
    configuracion,
    mapas,
  },
  data() {
    return {
      id: this.$route.query.id,
      tabActivo: 'sistema'
    };
  },
  methods: {
    routerlister(id) {
      this.$router.push({ path: "/listerpage" });
    }
  },
};
</script>
<style scoped>
.menu,.mobile{
  display:none;
}

@media only screen and (max-width: 768px) {
  .nav_item,
  .tittle {
    display: none;
  }
  .menu, .mobile{
    display: block;
  }
}

</style>