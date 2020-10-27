<template>
  <v-app>
    <br />
    <v-btn>Send</v-btn>
    <v-form ref="form" v-model="valid">
      {{models["device.identifier"]}}
      <v-jsf v-if="systemSchema" v-model="models" :schema="systemSchema" :options="options" />
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
    models: {
      type: Object,
      default: () => null
      ,
    }
  },
  data() {
    return {
      valid: false,
     
      options: {},
    };
  },
  
  

  methods: {},
};
</script>