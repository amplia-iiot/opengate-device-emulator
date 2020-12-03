<template>
    <div>
         <v-form ref="form" v-model="valid">
        <v-autocomplete :items="deviceEvents" label="Event to send to platform" v-model="selectedEvent" @change="eventChanged" />
        <v-jsf v-if="eventSchema" :schema="eventSchema" :options="options"  v-model="innerModel"/>
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
import VJsf from "@koumoul/vjsf/lib/VJsf.js"
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js"
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js"
export default {
    components: {
        VJsf,
    },
    mixins: [baseUserApiMixin],
    computed: {
        eventSchema() {
            let finalSchema = null
            if (this.selectedEvent) {
                switch (this.selectedEvent) {
                    case "endLifeTimeEvent":
                        finalSchema = {
                            type: "object",
                            properties: {
                                timeRemaining: {
                                    type: "number",
                                    title: "Time remaining"
                                }
                            },
                        }
                        break
                    case "tamperingEvent":
                        finalSchema = {
                            type: "object",
                            properties: {
                                reason: {
                                    type: "string",
                                    title: "Reason"
                                }
                            }
                        }
                        break
                    case "temperatureEvent":
                        finalSchema = {
                            type: "object",
                            properties: {
                                temperature: {
                                    type: "number",
                                    title: "Temperature"
                                },
                                threshold: {
                                    type: "number",
                                    title: "Threshold"
                                },
                                trend: {
                                    type: "string",
                                    title: "trend",
                                    enum: ["RISING", "DECREASING", "FLAT", "UNKNOWN"]
                                }
                            }
                        }
                        break
                    case "batteryEvent":
                        finalSchema = {
                            type: "object",
                            properties: {
                                batteryLevel: {
                                    type: "number",
                                    title: "Battery level"
                                },
                                threshold: {
                                    type: "number",
                                    title: "Threshold"
                                },
                                trend: {
                                    type: "string",
                                    title: "trend",
                                    enum: ["RISING", "DECREASING", "FLAT", "UNKNOWN"]
                                }
                            }
                        }
                        break
                }
                return finalSchema
            } else {
                return {
                    type: "object",
                    properties: {},
                }
            }
        },
        deviceId() {
            return this.$route.query.id
        },
    },
    data() {
        return {
            options: {},
            valid:false,
            innerModel:{},
            snackbar: false,
            selectedEvent: null,
            jsonModel:{},
            deviceEvents: ["birthEvent", "endLifeTimeEvent", "statusEvent", "tamperingEvent", "temperatureEvent", "batteryEvent"],
            activePage: null,
        }
    },
    methods: {
        eventChanged(newEvent){
             if (newEvent) {
                if (!localStorage.eventModel) {
                    localStorage.eventModel = JSON.stringify({})
                } else {
                    this.jsonModel = JSON.parse(localStorage.eventModel)
                }

                if (!this.jsonModel[this.deviceId]) {
                    this.jsonModel[this.deviceId] = {}
                }

                if (!this.jsonModel[this.deviceId][newEvent]) {
                    this.jsonModel[this.deviceId][newEvent] = {
                    }
                }
                this.innerModel = this.jsonModel[this.deviceId][newEvent]
             }
        },
        saveModel(){
            localStorage.eventModel = JSON.stringify(this.jsonModel)
            this.snackbar = true
        }
    }
}
</script>