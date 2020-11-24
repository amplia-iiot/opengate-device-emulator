<template>
<div class="pa-0 ma-0">
    <l-map style="height: calc(100vh - 140px); width:100%" :zoom="zoom" :center="center" @click="addMarker" @update:center="centerUpdated">
        <l-tile-layer :url="url"></l-tile-layer>
        <l-control :position="'bottomleft'">
            <v-card>
                {{logLat}}
            </v-card>
        </l-control>
        <div v-if="markerBol">
            <l-marker v-for="marker in markers" :lat-lng="marker" :key="marker.lat"></l-marker>
        </div>
    </l-map>

    <!-- </v-sheet> -->
</div>
</template>

<script>
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js"

// import VueLayers from "vuelayers";
// import "vuelayers/lib/style.css";

export default {
    mixins: [baseUserApiMixin],
    props: {
        model: {
            type: Object,
            default: () => null,
        }
    },
    name: "mapas",
    inject: {
        theme: {
            default: {
                isDark: false
            },
        },
    },
    data() {
        return {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            zoom: 2,
            btnSend: true,
            center: [0, 0],
            markerBol: false,
            markers: [
                []
            ],
            logLat: "LatLng(0, 0)",
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
    mounted() {
        if (this.model['entity.location']) {
            this.markers[0][1] = this.model['entity.location']._value._current.value.position.coordinates[0]
            this.markers[0][0] = this.model['entity.location']._value._current.value.position.coordinates[1]
            this.center = this.markers[0]
            this.logLat = "LatLng(" + this.markers[0][0] + ", " + this.markers[0][1] + ")"
            this.markerBol = true
        }
    },
    computed: {
        deviceId() {
            return this.$route.query.id;
        },
    },
    methods: {
        centerUpdated() {
            this.zoom = 5
        },
        addMarker(event) {
            this.markers.splice(0, 1, event.latlng)
            this.center = this.markers[0]
            this.logLat = this.markers[0]
            console.log(event.latlng)
            this.markerBol = true

            this.send()
        },
        async send() {
            try {
                let mb = this.$api
                    .deviceMessageBuilder()
                    .withDataStreamVersion("" + new Date().getTime())

                // Se pasan los datos del modelo al builder

                let datapointsBuilder = this.$api.datapointsBuilder().withValue(JSON.stringify([this.markers[0].lng, this.markers[0].lat]))
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
