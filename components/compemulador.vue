<template>
  <div id="app">
    <v-app id="inspire">
      <v-card class="overflow-hidden">
        <v-app-bar
          shrink-on-scroll
          prominent
          fade-img-on-scroll
          scroll-target="#scrolling-techniques-3"
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
            ></v-img>
          </template>
          <v-btn
            class="ma-2"
            color="orange darken-2"
            dark
            @click="routerlister"
          >
            <v-icon dark left> mdi-arrow-left </v-icon>Device {{ id }}
          </v-btn>

          <v-toolbar-title class="tittle"
            >Device Emulator</v-toolbar-title
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
                  <v-list-item-title @click="system">System</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="sensors"
                    >Sensors</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="operations"
                    >Operations</v-list-item-title
                  >
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="maps">Map</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            </div>
          
            <v-tabs align-with-title class="nav_item">
              <v-tab>System</v-tab>
              <v-tab-item>
                <sistema />
              </v-tab-item>
              <v-tab>Sensors</v-tab>
              <v-tab-item><sensores /></v-tab-item>
              <v-tab>Operations</v-tab>
              <v-tab-item>
                <configuracion />
              </v-tab-item>
              <v-tab>Map</v-tab>
              <v-tab-item><mapas/></v-tab-item>
            </v-tabs>
          </template>
        </v-app-bar>
        <v-sheet id="scrolling-techniques-3" class="overflow-y-auto">
          <v-container style="height: 1000px" 
            >
            <div class="mobile"><sistema :hidden="sys" /><sensores
              :hidden="sensor" /><configuracion :hidden="config" /><mapas
              :hidden="map"
          />
          </div></v-container>
        </v-sheet>
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
      sys: true,
      sensor: true,
      config: true,
      map: true,
    };
  },
  methods: {
    routerlister(id) {
      this.$router.push({ path: "/listerpage" });
    },
    system() {
      this.sys = false;
      this.sensor = true;
      this.config = true;
      this.map = true;
    },
    sensors() {
      this.sys = true;
      this.sensor = false;
      this.config = true;
      this.map = true;
    },
    operations() {
      this.sys = true;
      this.sensor = true;
      this.config = false;
      this.map = true;
    },
    maps() {
      this.sys = true;
      this.sensor = true;
      this.config = true;
      this.map = false;
    },
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