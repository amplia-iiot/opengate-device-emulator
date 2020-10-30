<template>
  <div class="pa-0 ma-0">
    <!-- <h4>Device Geolocation</h4>
    <v-sheet class="pa-3" style="height: auto">
      <v-col md="1">
        <v-text-field
          disable
          v-model="cordenadas"
          label="Cordenadas(Altitud/latitud)"
        ></v-text-field>
      </v-col> -->
      <vl-map data-projection="EPSG:4326" style="height: calc(100vh - 140px)">
        <vl-view
          :zoom.sync="zoom"
          :center.sync="center"
          :rotation.sync="rotation"
        ></vl-view>

        <vl-layer-tile>
          <vl-source-osm></vl-source-osm>
        </vl-layer-tile>

        <vl-feature>
          <vl-geom-point :coordinates="[-3.688173, 40.453206]"></vl-geom-point>
        </vl-feature>
      </vl-map>
    <!-- </v-sheet> -->
  </div>
</template>
<script>
import VueLayers from "vuelayers";
import "vuelayers/lib/style.css";
export default {
  components: {
    VueLayers,
  },
  name: "mapas",
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  data() {
    return {
      cordenadas: "",
      center: "",
      zoom: 15,
      center: [-3.688173, 40.453206],
      rotation: 0,
      cordenadas: "-3.688173, 40.453206",
      id_device: this.$route.query.id,
      date: null,
      trip: {
        name: "",
        location: null,
        start: null,
        end: null,
      },
    };
  },
};
</script>