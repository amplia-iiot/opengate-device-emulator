<template>
  <v-app>
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="boton"
          color="red"
          dark
          v-bind="attrs"
          v-on="on"
          depressed
        >
          Log out
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline"> ATTENTION </v-card-title>
        <v-card-text>Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="routerdialog = false">
            No
          </v-btn>
          <v-btn color="red" text @click="routerdialog"> YES </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template>
      <v-container>
          <br />
          <v-text-field
            label="Search device"
            clearable
            v-model="field"
            @keyup.enter.native="search"
          ></v-text-field>
        <v-card class="mx-auto">
          <v-list dense class="lista1">
            <v-subheader>Devices</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item v-for="value in devices" :key="value.id" @click="routeremulador(value)">
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
          <!-- <v-list dense class="lista2">
            <v-subheader>ID</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item v-for="resultado in resultados" :key="resultado.id">
                <v-list-item-content>
                 
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list> -->
        </v-card>
      </v-container>
    </template>
  </v-app>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  components: {
    VJsf,
  },
  mixins: [baseUserApiMixin],
  data() {
    return {
      deviceapi: [],
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

      if (this.field) {
        filter.and.push({
            or: [
              {
                like: {
                  "provision.device.identifier": this.field,
                }
              },
              {
                like: {
                  "provision.device.name": this.field,
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
          this.deviceapi = response.data.entities;
          this.devices = [];
          this.deviceapi.forEach((element) => {
            let device = {
              id: element["provision.device.identifier"]._value._current.value,
              organization: element["provision.administration.organization"]._value._current.value,
            };

            if (element["provision.device.name"]) {
              device.name = element["provision.device.name"]._value._current.value
            }

            this.devices.push(device)
          });
        })
    },
  },
  mounted() {
    this.search()
  },
};
</script>
<style scoped>
.boton {
  position: absolute;
  top: 0px;
  right: 0px;
}
.lista1 {
  float: left;
  width: 100%;
}
.lista2 {
  float: right;
}
</style>