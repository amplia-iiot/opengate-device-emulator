<template>
    <div>
        <v-autocomplete
          :items="availableOperations"
          label="Operation to configure"
          v-model="selectedOperation"
          @change="operationChanged"
        ></v-autocomplete>
        <div v-if="currentWorkingOperation">
          <v-card>
            <v-card-text>
          <p>function {{selectedOperation}}(operaData) {</p>
          <codemirror :options="cmOptions" v-model="currentWorkingOperation.code" />
          <p>}</p>
            </v-card-text>
          </v-card>
          <hr>
          <v-switch v-model="currentWorkingOperation.enabled" />
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
      operationsConfig: {
        "DEV_SPOOL_12" : {
          "ADMINISTRATIVE_STATUS_CHANGE": {
            code: 'codigo de ejemplo',
            enabled: true
          }
        }
      },
      currentWorkingOperation: null
    };
  },
  methods: {
    operationChanged(newOpera) {
      if (newOpera) {
        // se verifica que existe el dispositivo
        if (!this.operationsConfig[this.deviceId]) {
          this.operationsConfig[this.deviceId] = {}
        }

        if (!this.operationsConfig[this.deviceId][newOpera]) {
          this.operationsConfig[this.deviceId][newOpera] = {
            code: '',
            enabled: false,
          }
        }

        // se guarda una copia para trabajar con ella
        this.currentWorkingOperation = {...this.operationsConfig[this.deviceId][newOpera]}
      } else {
        this.currentWorkingOperation = null
      }
    },
    saveOperation() {
      alert("Operation save with your javascript thank you!");
    },
    deleteOperation() {
      this.code = "";
    },
  },
};
</script>