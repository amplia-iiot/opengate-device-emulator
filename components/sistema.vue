<template>
  <v-app>
    <br />
    <v-btn>Send</v-btn>
    <v-form ref="form" v-model="valid">
      <v-jsf v-if="systemSchema" v-model="model" :schema="systemSchema" :options="options" />
    </v-form>
  </v-app>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
export default {
  components: {
    VJsf,
  },
 props: {
    systemSchema: {
      type: Object,
      default: () => null
    },
    
  },
  data() {
    return {
      valid: false,
      readOnly: true,
      options: {},
      only: true,
      disabled1: false,
      disabled2: true,
       model: {
        temperatura: "",
        ram: "",
        hdd: "",
        bateria: "",
        id: 1,
      },
    };
  },
  
  

  methods: {},
};
</script>