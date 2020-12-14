<template>
<div>
    <v-form ref="form" v-model="valid">
        <v-autocomplete :items="deviceEvents" label="Event to send to platform" v-model="selectedEvent" @change="eventChanged" autowidth auto-select-first />
        <v-dialog v-model="logDialog" width="500">
            <template v-slot:activator="{ on, attrs}">
                <v-btn text v-bind="attrs" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="headline"> Add new event </v-card-title>
                <v-text-field v-model="eventTextField"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="saveEvent">
                        Save
                    </v-btn>
                    <v-btn color="red" text @click="logDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
        <v-btn text @click="mirrorMethod" :disabled="disabledMirror">
            <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn text @click="modelformMethod" :disabled="disabledModel">
            <v-icon> mdi-grease-pencil</v-icon>
        </v-btn>
        <div v-if="mirror">
            <codemirror :options="cmOptions" v-model="jsonLocal[deviceId][selectedEvent].code" @changes="linter" @onLoad="linter" ref="codemirror" />
            <v-btn text @click="saveSchema" :disabled="disabled">
                Save Schema
            </v-btn>
        </div>
        <div v-if="modelform">
        <v-form v-model="valid">
        <v-jsf v-model="jsonModel[deviceId][selectedEvent]" :schema="localSchema" :options="options"/>
    </v-form>
        </div>
        <v-btn @click="saveModel" fab fixed bottom right color="accent">
            <v-icon> mdi-send </v-icon>
        </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar">
        {{ "Event save and sended to platform" }}

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
import JsonSchemaEditor from 'json-schema-editor-vue'
import 'json-schema-editor-vue/lib/json-schema-editor-vue.css'
import "codemirror/theme/base16-dark.css"
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import VJsf from "@koumoul/vjsf/lib/VJsf.js"
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js"
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js"
import Ajv from 'ajv'
export default {
    components: {
        VJsf,
        codemirror,

    },
    mixins: [baseUserApiMixin],
    computed: {
        disabledMirror(){
            if(this.selectedEvent){
                return false
            }
            else {
                return true
            }
        },
        disabledModel(){
            if(this.selectedEvent){
                return false
            }
            else {
                return true
            }
        },

        deviceId() {
            return this.$route.query.id
        },
        deviceEvents() {
            if (this.jsonEvent[this.deviceId]) {
                console.log(this.jsonEvent[this.deviceId])

                if (Array.isArray(this.jsonEvent[this.deviceId])) {
                    return this.jsonEvent[this.deviceId]
                } else {
                    return this.jsonEvent[this.deviceId].split(",")
                }

            } else {

                this.jsonEvent[this.deviceId] = ["birthEvent", "endLifeTimeEvent", "statusEvent", "tamperingEvent", "temperatureEvent", "batteryEvent"]
                console.log(this.jsonEvent[this.deviceId])
                    return this.jsonEvent[this.deviceId]
                
            }
        }
    },
    mounted() {
        if (localStorage.events) {
            this.jsonEvent = JSON.parse(localStorage.events)
        } else {
            localStorage.events = JSON.stringify({})
        }

    },
    data() {
        return {
            localSchema:{},
            innerModel:{},
            modelform:false,
            jsonLocal: {},
            disabled: false,
            mirror: false,
            logDialog: false,
            options: {},
            valid: false,
            innerModel: {},
            snackbar: false,
            selectedEvent: null,
            jsonModel: {},
            activePage: null,
            eventTextField: "",
            jsonEvent: {},
            widgets: [],
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
        }
    },
    methods: {
        mirrorMethod(){
            if(this.mirror){
                this.mirror = false
            }
            else if(!this.mirror){
                this.mirror = true
                 setTimeout(() => {
                this.linter()
            }, 1000)
            }
        },
         modelformMethod(){
            if(this.modelform){
                this.modelform = false
            }
            else if(!this.modelform){
                this.modelform = true
            }
        },
        linter() {
            if(this.mirror){

            
            let mirror = this.$refs.codemirror.codemirror
            this.widgets.forEach(element => {
                mirror.removeLineWidget(element)
            });
            this.widgets.splice(0, this.widgets.length)

            const value = mirror.getValue()
            let ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
            let validate = ajv.compile({
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://json-schema.org/draft-07/schema#",
                "title": "Core schema meta-schema",
                "definitions": {
                    "schemaArray": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                            "$ref": "#"
                        }
                    },
                    "nonNegativeInteger": {
                        "type": "integer",
                        "minimum": 0
                    },
                    "nonNegativeIntegerDefault0": {
                        "allOf": [{
                                "$ref": "#/definitions/nonNegativeInteger"
                            },
                            {
                                "default": 0
                            }
                        ]
                    },
                    "simpleTypes": {
                        "enum": [
                            "array",
                            "boolean",
                            "integer",
                            "null",
                            "number",
                            "object",
                            "string"
                        ]
                    },
                    "stringArray": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "uniqueItems": true,
                        "default": []
                    }
                },
                "type": ["object", "boolean"],
                "properties": {
                    "$id": {
                        "type": "string",
                        "format": "uri-reference"
                    },
                    "$schema": {
                        "type": "string",
                        "format": "uri"
                    },
                    "$ref": {
                        "type": "string",
                        "format": "uri-reference"
                    },
                    "$comment": {
                        "type": "string"
                    },
                    "title": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "default": true,
                    "readOnly": {
                        "type": "boolean",
                        "default": false
                    },
                    "examples": {
                        "type": "array",
                        "items": true
                    },
                    "multipleOf": {
                        "type": "number",
                        "exclusiveMinimum": 0
                    },
                    "maximum": {
                        "type": "number"
                    },
                    "exclusiveMaximum": {
                        "type": "number"
                    },
                    "minimum": {
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "type": "number"
                    },
                    "maxLength": {
                        "$ref": "#/definitions/nonNegativeInteger"
                    },
                    "minLength": {
                        "$ref": "#/definitions/nonNegativeIntegerDefault0"
                    },
                    "pattern": {
                        "type": "string",
                        "format": "regex"
                    },
                    "additionalItems": {
                        "$ref": "#"
                    },
                    "items": {
                        "anyOf": [{
                                "$ref": "#"
                            },
                            {
                                "$ref": "#/definitions/schemaArray"
                            }
                        ],
                        "default": true
                    },
                    "maxItems": {
                        "$ref": "#/definitions/nonNegativeInteger"
                    },
                    "minItems": {
                        "$ref": "#/definitions/nonNegativeIntegerDefault0"
                    },
                    "uniqueItems": {
                        "type": "boolean",
                        "default": false
                    },
                    "contains": {
                        "$ref": "#"
                    },
                    "maxProperties": {
                        "$ref": "#/definitions/nonNegativeInteger"
                    },
                    "minProperties": {
                        "$ref": "#/definitions/nonNegativeIntegerDefault0"
                    },
                    "required": {
                        "$ref": "#/definitions/stringArray"
                    },
                    "additionalProperties": {
                        "$ref": "#"
                    },
                    "definitions": {
                        "type": "object",
                        "additionalProperties": {
                            "$ref": "#"
                        },
                        "default": {}
                    },
                    "properties": {
                        "type": "object",
                        "additionalProperties": {
                            "$ref": "#"
                        },
                        "default": {}
                    },
                    "patternProperties": {
                        "type": "object",
                        "additionalProperties": {
                            "$ref": "#"
                        },
                        "propertyNames": {
                            "format": "regex"
                        },
                        "default": {}
                    },
                    "dependencies": {
                        "type": "object",
                        "additionalProperties": {
                            "anyOf": [{
                                    "$ref": "#"
                                },
                                {
                                    "$ref": "#/definitions/stringArray"
                                }
                            ]
                        }
                    },
                    "propertyNames": {
                        "$ref": "#"
                    },
                    "const": true,
                    "enum": {
                        "type": "array",
                        "items": true,
                        "minItems": 1,
                        "uniqueItems": true
                    },
                    "type": {
                        "anyOf": [{
                                "$ref": "#/definitions/simpleTypes"
                            },
                            {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/simpleTypes"
                                },
                                "minItems": 1,
                                "uniqueItems": true
                            }
                        ]
                    },
                    "format": {
                        "type": "string"
                    },
                    "contentMediaType": {
                        "type": "string"
                    },
                    "contentEncoding": {
                        "type": "string"
                    },
                    "if": {
                        "$ref": "#"
                    },
                    "then": {
                        "$ref": "#"
                    },
                    "else": {
                        "$ref": "#"
                    },
                    "allOf": {
                        "$ref": "#/definitions/schemaArray"
                    },
                    "anyOf": {
                        "$ref": "#/definitions/schemaArray"
                    },
                    "oneOf": {
                        "$ref": "#/definitions/schemaArray"
                    },
                    "not": {
                        "$ref": "#"
                    }
                },
                "default": true
            }
            )
            let valid = validate(value)
            validate.errors.forEach(error => {
                
                this.disabled = true
                let msg = document.createElement("div")
                let icon = msg.appendChild(document.createElement("span"))
                icon.className = "lint-error-icon"
                msg.className = "lint-error"
                this.widgets.push(mirror.addLineWidget(0, msg, {
                    coverGutter: false,
                    noHScroll: true
                }))
            })
            console.log(validate.errors)
            if (validate.errors.length == 0) {
                this.disabled = false
            }

            let info = mirror.getScrollInfo();
            let after = mirror.charCoords({
                line: mirror.getCursor().line + 1,
                ch: 0
            }, "local").top
            if (info.top + info.clientHeight < after)
                mirror.scrollTo(null, after - info.clientHeight + 3)
            if (this.jsonLocal[this.deviceId][this.selectedEvent].code === "{}") {
                this.disabled = true
            }
           
            else {
                this.disabled = false
            }
         console.log(valid)
         console.log(validate.errors)
            }
        },
        saveSchema(){
            this.mirror = false
            this.localSchema = JSON.parse(this.jsonLocal[this.deviceId][this.selectedEvent].code)
            localStorage.eventsConfig = JSON.stringify(this.jsonLocal)
        },
        saveEvent() {
            if (Array.isArray(this.jsonEvent[this.deviceId])) {
                this.jsonEvent[this.deviceId].push(this.eventTextField)
            } else {
                this.jsonEvent[this.deviceId] = this.jsonEvent[this.deviceId].split(",")
                this.jsonEvent[this.deviceId].push(this.eventTextField)
                console.log(this.eventTextField)

            }
            localStorage.events = JSON.stringify(this.jsonEvent)
            this.eventTextField = ''
            this.logDialog = false

        },
        eventChanged(newEvent) {
            if (newEvent) {
                if (!localStorage.eventsConfig) {
                    localStorage.eventsConfig = JSON.stringify({})
                }
                else{
                     this.jsonLocal = JSON.parse(localStorage.eventsConfig)
                }
                 

                if (!this.jsonLocal[this.deviceId]) {
                    this.jsonLocal[this.deviceId] = {}
                }
                if(!this.jsonLocal[this.deviceId][newEvent]){
                   
                    this.jsonLocal[this.deviceId][newEvent] = {
                        code: "{}"
                    }
                }
               
                this.localSchema = JSON.parse(this.jsonLocal[this.deviceId][newEvent].code)

               
                // se guarda una copia para trabajar con ella
            }
                if (!localStorage.eventModel) {
                    localStorage.eventModel = JSON.stringify({})
                } else {
                    this.jsonModel = JSON.parse(localStorage.eventModel)
                }

                if (!this.jsonModel[this.deviceId]) {
                    this.jsonModel[this.deviceId] = {}
                }

                if (!this.jsonModel[this.deviceId][newEvent]) {
                    this.jsonModel[this.deviceId][newEvent] = {}

                }
                this.innerModel = this.jsonModel[this.deviceId][newEvent]
             setTimeout(() => {
                this.linter()
            }, 1000)
            
        },
        saveModel() {
            localStorage.eventModel = JSON.stringify(this.jsonModel)
            this.snackbar = true
            let eventObj = {
                "event": {
                    "alarm": {
                        "deviceId": this.deviceId,
                        "severity": "INFORMATIVE",
                        "priority": "LOW",
                        "name": this.selectedEvent,
                        "timestamp": new Date().getTime(),
                        "variables": [this.jsonModel[this.deviceId][this.selectedEvent]]
                    }
                }
            }
            this.$api.Sapi.post(`devices/${this.deviceId}/events/alarms`, eventObj)
        }
    }
}
</script>

<style scoped>
.autocomplete {
    width: 80%
}
</style>
