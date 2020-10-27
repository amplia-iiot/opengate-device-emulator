<template>
<div>
    <v-content>
    <v-app-bar color="primary" dark app >
  
    <template>
      <v-container>
          <v-toolbar color="primary" dense>
          <v-text-field
            label="Search device"
            clearable
            v-model="field"
            @keyup.enter.native="search"
          ></v-text-field><v-btn icon @click="search">
          <v-icon>mdi-magnify</v-icon>
        </v-btn><v-dialog v-model="dialog" persistent max-width="290">
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
          <v-btn color="green darken-1" text @click="dialog = false">
            No
          </v-btn>
          <v-btn color="red" text @click="routerdialog"> YES </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog></v-toolbar>
          </v-container>
          </template>
          </v-app-bar>
          </v-content>
  </div>
  
</template>
<script>
import { mapMutations } from 'vuex'
import textField from '@/mixins/textfield.mixin.js'
export default {
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
methods:{
    ...mapMutations({
        sendText: 'appbar/setFilter'
    }),
    routerdialog() {
      this.$router.push({ path: "/" });
    },
    search(){
        this.sendText({
            text: this.field
        })
    }
}

}
</script>
