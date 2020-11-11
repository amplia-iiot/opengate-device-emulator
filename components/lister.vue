<template>
  <v-list dense>
    <v-list-item-group color="primary">
      <v-list-item v-for="value in this.devices" :key="value.id" @click="routeremulador(value)">
        <v-list-item-content>
          <v-list-item-title>
            {{ value.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ value.id }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";
import textField from '@/mixins/textField.mixin.js'
import { mapMutations } from "vuex";

export default {
  components: {
    VJsf,
  },
  mixins: [baseUserApiMixin,textField],
  data() {
    return {
      todo: true,
      devices: [],
      field: null,
      dialog: false,
      valid: false,
    };
  },
  methods: {
     
    routeremulador(deviceData) {
      this.$router.push({ path: "/emulador", query: { id: deviceData.id, organization: deviceData.organization } });
    },
    routerdialog() {
      this.$router.push({ path: "/" });
    },
    search(deviceFilter) {
      this.devices = [];

      let searcherBuilder = this.$api.entitiesSearchBuilder().flattened().limit(50, 1)

      const filter = {
        and: [
          {
            eq: {
              resourceType: "entity.device",
            }
          }
        ]
      }
      if (deviceFilter) {
        filter.and.push({
            or: [
              {
                like: {
                  "provision.device.identifier": deviceFilter,
                }
              },
              {
                like: {
                  "provision.device.name": deviceFilter,
                  "provision.device.name": deviceFilter,
                }
              }
            ]
          })
      }
      const response = searcherBuilder
        .filter(filter)
        .build()
        .execute()
        .then((response) => {
          console.log(response)
          const deviceapi = response.data.entities
          this.devices = []
          deviceapi.forEach((element) => {
            if (element["provision.device.identifier"]) {
              let device = {
                id: element["provision.device.identifier"]._value._current.value,
                organization: element["provision.administration.organization"]._value._current.value,
              };

              if (element["provision.device.name"]) {
                device.name = element["provision.device.name"]._value._current.value
              }

              this.devices.push(device)
            }
            
          });
        })
    },
  },
  mounted() {
    if(this.$api){
     this.search()
    }
    else {
      this.$router.push("/")
    }
    
  },
  watch:{
    textField: {
      handler(newVal){
        this.search(newVal)
      }
    }
  }
};
</script>

<style scoped>
.boton {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>