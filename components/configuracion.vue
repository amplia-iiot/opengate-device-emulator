<template>
  <v-app>
    <br />
    <v-form>
      <v-form ref="form" v-model="valid">
        <v-autocomplete
          style="color: red"
          :items="items"
          label="Operation to make:"
          required
          v-model="model"
        ></v-autocomplete>
        <codemirror :options="cmOptions" v-model="code" />
        <v-btn @click="send" class="send"> Send </v-btn>
        <v-btn @click="reset" class="reset"> Reset </v-btn>
      </v-form>
    </v-form>
  </v-app>
</template> 
<script>
import "codemirror/mode/javascript/javascript.js";
import { codemirror } from 'vue-codemirror';
import "codemirror/theme/base16-dark.css";
import 'codemirror/lib/codemirror.css';

import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
export default {
  components: {
    VJsf,
    codemirror,
  },

  data() {
    return {
      code: "",
      cmOptions: {
        tabSize: 1,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/javascript",
        lineWrapping: true,
        theme: "default",
      },
      model: null,
      items: [
        "REBOOT_EQUIPMENT",
        "POWER_OFF_EQUIPMENT",
        "POWER_ON_EQUIPMENT",
        "REFRESH_LOCATION",
        "REFRESH_INFO",
        "REFRESH_PRESENCE",
        "STATUS_DIAGNOSTIC",
      ],
      valid: false,
      readOnly: true,
      code: "if(...){....}else{....}",
      only: true,
      disabled1: false,
      disabled2: true,
    };
  },
  
  

  methods: {
    send() {
      alert("Operation send with your javascript thank you!");
    },
    reset() {
      this.code = "";
    },
  },
};
</script>