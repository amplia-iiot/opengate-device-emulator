<template>
    <div>
        <v-autocomplete
          :items="availableOperations"
          label="Operation to configure"
          v-model="selectedOperation"
          @change="operationChanged"
        ></v-autocomplete>
        <div v-if="jsonLocal">
          <v-card>
            <v-card-text>
          <p>function {{selectedOperation}}(operaData) {</p>
          <codemirror :options="cmOptions" v-model="jsonLocal[deviceId][selectedOperation].code" />
          <p>}</p>
            </v-card-text>
          </v-card>
          <hr>
          <v-switch v-model="jsonLocal[deviceId][selectedOperation].enabled" />
          <v-btn @click="saveOperation"> Save </v-btn>
          <v-btn @click="deleteOperation"> Delete </v-btn>
        </div>
    </div>
</template> 
<script>
import "codemirror/mode/javascript/javascript.js";
import { codemirror } from 'vue-codemirror';
import "codemirror/theme/base16-dark.css";
import 'codemirror/lib/codemirror.css';

import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";

export default {
  components: {
    VJsf,
    codemirror,
  },
  mixins: [baseUserApiMixin],
  computed: {
    deviceId() {
      return this.$route.query.id
    }
  },
  async mounted() {
    const operationsCatalog = await this.$api.rawSearchBuilder().from('/catalog/operations').build().execute()

    if (operationsCatalog.statusCode === 200) {
      const defaultOperations = operationsCatalog.data.operations.map(operation => operation.name)

      this.availableOperations = [...defaultOperations]
    }
    if(!localStorage.operationsConfig){
      localStorage.operationsConfig =  JSON.stringify({})
      this.jsonLocal = JSON.parse(localStorage.operationsConfig)
    }
    else {
      this.jsonLocal = JSON.parse(localStorage.operationsConfig)
    }

  },
  data() {
    return {
      availableOperations:null,
      cmOptions: {
        tabSize: 1,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: "text/javascript",
        lineWrapping: true,
        theme: "default",
      },
      selectedOperation: null,
      code: "",
      jsonLocal: null,
      jsonLocal: null
    }
  },
  methods: {
    operationChanged(newOpera) {
      if (newOpera) {
        if (!this.jsonLocal[this.deviceId]) {
          this.jsonLocal[this.deviceId] = {}
        }

        if (!this.jsonLocal[this.deviceId][newOpera]) {
         this.jsonLocal[this.deviceId][newOpera] = {
            code: '',
            enabled: false
          }
        }

        // se guarda una copia para trabajar con ella
      } else {
        this.jsonLocal = null
      }
    },
    saveOperation() {
      localStorage.operationsConfig = JSON.stringify(this.jsonLocal)
      alert("Operation save with your javascript thank you!");
    },
    deleteOperation() {
      this.code = "";
      this.jsonLocal[this.deviceId][this.selectedOperation].code = ""
      localStorage.operationsConfig = JSON.stringify(this.jsonLocal)
    },
  },
};
</script>