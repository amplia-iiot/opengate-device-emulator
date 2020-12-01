<template>
<div>
    <v-autocomplete :items="operationsMap" label="Operation to configure" v-model="selectedOperation" @change="operationChanged" item-text="value">
        <template v-slot:item="{item, on}">
            <v-list-item v-on="on">
                <v-list-item-title>
                    {{item.text.name}}
                </v-list-item-title>
                <v-list-item-icon v-if="item.text.configured">
                    <v-icon>mdi-notebook-edit</v-icon>
                </v-list-item-icon>
            </v-list-item>
        </template>
    </v-autocomplete>
    <div v-if="jsonLocal && jsonLocal[deviceId] && jsonLocal[deviceId][selectedOperation]">
        <v-card>
            <v-card-text>
                <p>function {{selectedOperation}}(<v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                operaRequest
                            </span>
                        </template>
                        <span>
                            <pre>
          operaRequest: {
            operation:{
              request:{
                name,
                id,
                timestamp,
                params
              }
            }
          }</pre>
                        </span>
                    </v-tooltip>,
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                operaResponse
                            </span>
                        </template>
                        <span>
                            <pre>
          operaResponse: {
            operation:{
              response:{
                name,
                id,
                timestamp,
                resultcode,
                resultDescription
              }
            }
          }</pre>
                        </span>
                    </v-tooltip>) {</p>
                <codemirror :options="cmOptions" v-model="jsonLocal[deviceId][selectedOperation].code" @changes="linter" ref="codemirror" />

                <p>
                    <pre>return operaResponse
            }
            </pre>
                </p>
            </v-card-text>
        </v-card>
        <hr>
        <v-switch v-model="jsonLocal[deviceId][selectedOperationLocal].enabled" :label="'If switch on code above will run when operation executes'" />
        <v-btn @click="saveOperation"> Save </v-btn>
        <v-btn @click="deleteOperation"> Delete </v-btn>
    </div>
    <v-snackbar v-model="snackbar">
        {{ "Operation save with your javascript thank you!" }}

        <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import "codemirror/mode/javascript/javascript.js"
import {
    codemirror
} from 'vue-codemirror'
import {
    JSHINT
} from "jshint/dist/jshint.js"
import "codemirror/theme/base16-dark.css"
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import VJsf from "@koumoul/vjsf/lib/VJsf.js"
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js"

import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js"
window.JSHINT = JSHINT
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
        operationsMap() {
            if (!this.availableOperations) {
                return []
            }
            if (!localStorage.operationsConfig) {
                return {
                    ...this.availableOperations
                }
            } else {
                const jsonList = JSON.parse(localStorage.operationsConfig)

                return this.availableOperations.map((operationName) => {
                    const finalElement = {
                        text: {
                            name: operationName,
                            configured: false,
                            enabled: false
                        },
                        value: operationName
                    }
                    if (jsonList[this.deviceId] && jsonList[this.deviceId][operationName]) {
                        finalElement.text.configured = true

                    }
                    return finalElement

                })
            }

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
            availableOperations: null,
            snackbar: false,
            availableOperationsItems: [],
            operationsObject: {
                operation: "",
                configured: false
            },
            cmOptions: {
                tabSize: 1,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                lint: true,
                mode: "javascript",
                gutters: ["CodeMirror-lint-markers"],
                lineWrapping: true,
                theme: "default",
            },
            selectedOperation: null,
            selectedOperationLocal: null,
            jsonLocal: {},
            jsonList: {},
            widgets: []
        }
    },
    methods: {
        linter() {
          let mirror = this.$refs.codemirror.codemirror
            this.widgets.forEach(element => {
              mirror.removeLineWidget(element)
            });
            this.widgets.splice(0,this.widgets.length)
            
            const value = "(function(operaRequest, operaResponse){\n" + mirror.getValue() +
                "\nreturn operaResponse})"
            JSHINT(value)
            JSHINT.errors.forEach(error=>{
              let msg = document.createElement("div")
              let icon = msg.appendChild(document.createElement("span"))
              icon.className = "lint-error-icon"
              msg.className = "lint-error"
              this.widgets.push(mirror.addLineWidget(error.line , msg, {coverGutter: false, noHScroll: true}))
            })
            
                  
            
            let info = mirror.getScrollInfo();
            let after = mirror.charCoords({line: mirror.getCursor().line + 1, ch: 0}, "local").top;
            if (info.top + info.clientHeight < after)
                mirror.scrollTo(null, after - info.clientHeight + 3);
        },
        operationChanged(newOpera) {
            if (newOpera) {
                if (!localStorage.operationsConfig) {
                    localStorage.operationsConfig = JSON.stringify({})
                } else {
                    this.jsonLocal = JSON.parse(localStorage.operationsConfig)
                }

                if (!this.jsonLocal[this.deviceId]) {
                    this.jsonLocal[this.deviceId] = {}
                }

                if (!this.jsonLocal[this.deviceId][newOpera]) {
                    this.jsonLocal[this.deviceId][newOpera] = {
                        code: '',
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
}
</script>

<style scoped>
</style>
