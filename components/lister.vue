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
        <v-form>
          <br />
          <v-text-field
            label="Search device"
            clearable
            v-model="field"
          ></v-text-field>
        </v-form>
        <v-card class="mx-auto">
          <v-list dense class="lista1">
            <v-subheader>Devices</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item v-for="resultado in resultados" :key="resultado.id" @click="routeremulador(resultado.id)">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="resultado.Nombre"
                  ></v-list-item-title>
                   <v-list-item-subtitle 
                  v-text="resultado.id"
                  ></v-list-item-subtitle>
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
      {{ field }}
    </template>
  </v-app>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js"
import "@koumoul/vjsf/lib/VJsf.css"
import "@koumoul/vjsf/lib/deps/third-party.js"

import baseUserApiMixin from '@/mixins/baseUserApi.mixin.js'

export default {
  components: {
    VJsf
  },
  mixins: [baseUserApiMixin],
  data() {
    return {
      todo: true,
      field: null,
      dialog: false,
      valid: false,
      models: [
        {
          Nombre: "Samsung s9",
          id: 1234,
        },
        {
          Nombre: "One plus nord",
          id: 4567,
        },

        {
          Nombre: "Iphone 11",
          id: 8901,
        },

        {
          Nombre: "Xiaomi Redmi",
          id: 2345,
        },

        {
          Nombre: "Apple watch",
          id: 6789,
        },
      ],
    };
  },
  methods: {
    routeremulador(id){
      this.$router.push({ path: '/emulador', query: { id: id } })
    },
    routerdialog(){
      this.$router.push({path:'/'})
    }
  },
  computed: {
    resultados() {
      let resultados = [];
      this.models.forEach((model) => {
        if (
          !this.field ||
          model.Nombre.includes(this.field) ||
          model.id == this.field
        ) {
          resultados.push(model);
        }
      });
      return resultados;
    },
  },
  mounted() {
    // Busqueda de todos
  // this.$api.entitiesSearchBuilder().flattened().filter(
  //     { 
  //       and: [
  //         {
  //             "eq": {
  //                 "resourceType": "entity.device"
  //             }
  //         }
  //       ]
  //     }
  //   ).limit(50, 1).build().execute()

    // Busqueda con filtro
//   this.$api.entitiesSearchBuilder().flattened().filter(
      // { 
      //   and: [
      //     {
      //         "eq": {
      //             "resourceType": "entity.device"
      //         }
      //     },
      //     { 
      //       or: [
      //         {
      //             "like": {
      //                 "provision.device.identifier": "filtro"
      //             }
      //         },
      //         {
      //             "like": {
      //                 "provision.device.name": "filtro"
      //             }
      //         }
      //       ]
      //     } 
      //   ]
      // }
//     ).limit(50, 1).build().execute()
    
  }
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