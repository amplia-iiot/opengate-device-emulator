<template>
  <div class="pa-0 ma-0">
    <l-map style="height: calc(100vh - 140px); width:100%" :zoom="zoom" :center="center"  @click="addMarker">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-control class="example-custom-control">
       <v-btn :disabled="btnSend" @click="send">Send new location</v-btn>
      </l-control>
      <l-control
        :position="'bottomleft'"
       
      >
      <v-card>
        <v-card-text>{{logLat}}</v-card-text>
        </v-card>
      </l-control>
      <l-marker v-for="marker in markers" :lat-lng="marker" v-bind:key="marker.lat"></l-marker>
    </l-map>

    <!-- </v-sheet> -->
  </div>
</template>
<script>
import {LMap, LTileLayer, LMarker, LPopup, LControl} from "vue2-leaflet"
import 'leaflet/dist/leaflet.css'
import iconShadow from'leaflet/dist/images/marker-shadow.png'
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js"

// import VueLayers from "vuelayers";
// import "vuelayers/lib/style.css";

export default {
   mixins: [baseUserApiMixin],
  props:{
     model: {
      type: Object,
      default: () => null,
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl
  },
  name: "mapas",
  inject: {
    theme: {
      default: { isDark:false },
    },
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom:5,
      btnSend: true,
      center: [0,0],
      markers: [
        (0,0)
      ],
      logLat:"LatLng(0, 44.34082)",
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
  mounted(){
    if(this.model['entity.location']){
      this.center= this.model['entity.location']._value._current.value.position.coordinates
      this.markers[0] = this.model['entity.location']._value._current.value.position.coordinates
      this.logLat="LatLng("+this.markers[0][0]+", "+this.markers[0][1]+")"
    }
  },
  computed:{
    deviceId() {
      return this.$route.query.id;
    },
  },
  methods: {
    addMarker(event) {
      this.markers.push(event.latlng)
      this.markers.splice(0, 1)
      this.center=event.latlng
      this.logLat=this.markers[0]
      console.log(event.latlng)
      this.btnSend = false
    },
     async send(){
     try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime())
        
        // Se pasan los datos del modelo al builder
       
            let datapointsBuilder = this.$api.datapointsBuilder().withValue(JSON.stringify([this.markers[0].lat, this.markers[0].lng]))
            let datastreamBuilder = this.$api.datastreamBuilder().withId("entity.location")
            mb.withDataStream(datastreamBuilder.withDatapoint(datapointsBuilder))
         
        // se pasa el id del dispositivo a actualizar
        mb.withId(this.$route.query.id)

        // se lanza la petición
        const result = await mb.create()

      } catch (errorApi) {
        console.error(errorApi);
      }
    }
  }
}
</script>