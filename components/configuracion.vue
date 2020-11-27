<template>
    <div>
        <v-autocomplete
          :items="availableOperations"
          label="Operation to configure"
          v-model="selectedOperation"
          @change="operationChanged"
        >
        </v-autocomplete>
        <div v-if="jsonLocal && jsonLocal[deviceId] && jsonLocal[deviceId][selectedOperationLocal]">
          <v-card>
            <v-card-text>
          <p>function {{selectedOperation}}(<v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs"
            v-on="on"
          >
            operaRequest
          </span>
        </template>
        <span>
          operaRequest.operation.request.name
          <br>
          operaRequest.operation.request.id
          <br>
          operaRequest.operation.request.timestamp
          <br>
          operaRequest.operation.request.params
        </span>
      </v-tooltip>,
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs"
            v-on="on"
          >
            operaResponse
          </span>
        </template>
        <span>
          operaResponse.operation.request.name
          <br>
          operaResponse.operation.request.id
          <br>
          operaResponse.operation.request.timestamp
          <br>
          operaResponse.operation.request.resultCode
          <br>
          operaResponse.operation.request.resultDescription
        </span>
      </v-tooltip>) {</p>
          <codemirror :options="cmOptions" v-model="jsonLocal[deviceId][selectedOperationLocal].code" />
          <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            mdi-help
          </v-icon>
        </template>
        <span>This function must return a operaResponse object that will be send as response to the opengate platform</span>
      </v-tooltip>
          <p>}</p>
            </v-card-text>
          </v-card>
          <hr>
          <v-switch v-model="jsonLocal[deviceId][selectedOperationLocal].enabled" :label="'Code above will run when operation executes'"/>
          <v-btn @click="saveOperation"> Save </v-btn>
          <v-btn @click="deleteOperation"> Delete </v-btn>
        </div>
        <v-snackbar
        v-model="snackbar"
      >
        {{ "Operation save with your javascript thank you!" }}
  
        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
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
    },
    operationsMap(){
       if(!localStorage.operationsConfig){
          localStorage.operationsConfig = JSON.stringify({})
        } else {
          this.jsonList = JSON.parse(localStorage.operationsConfig)
        }
      let localOperations = this.availableOperations.map((element)=>{
        return element
      })
      localOperations.forEach(element => {
        this.operationsObject.operation = element
      if(this.jsonList[this.deviceId][element]){
        this.operationsObject.conigured = true
      }

        this.availableOperationsItems.push(this.operationsObject)
      })
      return this.availableOperationsItems
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
      snackbar: false,
      availableOperationsItems:[],
      operationsObject:{
        operation: "",
        configured: false
      },
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
      selectedOperationLocal: null,
      jsonLocal: {},
      jsonList:{},
    }
  },
  methods: {
    operationChanged(newOpera) {
      if (newOpera) {
        if(!localStorage.operationsConfig){
          localStorage.operationsConfig = JSON.stringify({})
        } else {
          this.jsonLocal = JSON.parse(localStorage.operationsConfig)
        }
        
        if (!this.jsonLocal[this.deviceId]) {
          this.jsonLocal[this.deviceId] = {}
        }

        if (!this.jsonLocal[this.deviceId][newOpera]) {
         this.jsonLocal[this.deviceId][newOpera] = {
            code: 'return operaResponse',
            enabled: false
          }
        }

        this.selectedOperationLocal = newOpera

        // se guarda una copia para trabajar con ella
      } else {
this.selectedOperationLocal = null
      }
    },
    saveOperation() {
      localStorage.operationsConfig = JSON.stringify(this.jsonLocal)
      this.snackbar = true
    },
    deleteOperation() {
      this.code = "";
      localStorage.operationsConfig = JSON.stringify(this.jsonLocal)
    },
  },
};
</script>