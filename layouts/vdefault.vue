<template>
<v-app id="inspire">
    <v-app-bar extended app color="primary" dense dark elevate-on-scroll>
        <v-app-bar-nav-icon @click="routerlister" v-if="deviceId">
            <v-icon> mdi-chevron-left </v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>
            {{
          deviceId ? "" + deviceId + " Emulator" : "Select device to emulate"
        }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
            <v-dialog v-model="logDialog" width="500">
                <template v-slot:activator="{ on, attrs}">
                    <v-btn text v-bind="attrs" v-on="on" @click="contOperations=0">
                        <v-badge :content="contOperations" :value="contOperations" color="error">
                            <v-icon v-if="isEmulatorConnected" color="success">mdi-lan-connect</v-icon>
                            <v-icon v-else color="error">mdi-lan-disconnect</v-icon>
                        </v-badge>
                    </v-btn>
                </template>
                <!-- Comiezo del DIALOG -->
                <v-card>
                    <v-card-title class="pa-0">
                        <v-toolbar flat width="100%">
                            <v-toolbar-title>
                                Events
                            </v-toolbar-title>

                            <v-spacer />
                            <v-toolbar-items>
                                <v-divider vertical inset />
                                <v-btn color="error" icon @click="logDialog = false">
                                    <v-icon dark>
                                        mdi-close
                                    </v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                    </v-card-title>

                    <v-card-text class="pa-1">
                        <!-- Lista de tareas, DeviceId, DateTime, Type, Description falla -->
                        <v-list two-line>
                            <v-list-item v-for="(item, index) in eventArr" :key="item.type + '_' + index">
                                <v-list-item-icon>
                                                                        <v-icon v-text="listIcon"> </v-icon>

                                    <v-icon v-if="item.type === 'Connect'" >mdi-lan-connect</v-icon>
                                    <v-icon v-else-if="item.type === 'Disconnect'">mdi-lan-disconnect</v-icon>
                                    <v-icon v-else-if="item.type === 'SUCCESSFUL'">mdi-thumb-up</v-icon>
                                    <v-icon v-else-if="item.type === 'NOT_SUPPORTED'">mdi-thumb-down</v-icon>
                                    <v-icon v-else-if="item.type === 'CANCELLED'">mdi-thumb-down</v-icon>
                                    <v-icon v-else-if="item.type === 'NOT_CONFIGURED'">mdi-thumb-down</v-icon>
                                    



                                    <v-icon v-else> mdi-pencil</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>

                                    <v-list-item-title>

                                    </v-list-item-title>
                                    <v-list-item-title v-text="item.type">

                                    </v-list-item-title>

                                    <v-list-item-subtitle class="text--primary" v-text="item.devId"></v-list-item-subtitle>

                                    <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-list-item-action-text v-text="item.dateTime"></v-list-item-action-text>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-divider inset vertical />
            <v-menu v-model="menu" :close-on-content-click="false" offset-y class="logout">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on">
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon color="indigo">
                                mdi-email
                            </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{
                                        this.$store.state.appbar.user
                                        }}</v-list-item-title>
                            <v-list-item-subtitle>User</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-dialog v-model="logoutDialog" persistent>
                        <template v-slot:activator="{ on, attrs }" align-center>
                            <div class="text-center">
                                <v-btn color="red" dark v-bind="attrs" v-on="on" depressed>
                                    Log out
                                </v-btn>
                            </div>
                        </template>
                        <v-card>
                            <v-card-title class="headline"> ATTENTION </v-card-title>
                            <v-card-text>Are you sure?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="logoutDialog = false">
                                    No
                                </v-btn>
                                <v-btn color="red" text @click="routerdialog"> YES </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-menu>
        </v-toolbar-items>

        <template v-slot:extension>
            <v-text-field v-if="!deviceId" label="Search device" clearable v-model="field" @keyup.enter="search" @click:append="search" @click:clear="search" single-line solo solo-inverted hide-details dense append-icon="mdi-magnify" />

            <v-tabs v-if="deviceId" v-model="tabActivo" grow centered dense icons-and-text>
                <v-tab class="ma-0" href="#sistema">
                    <span class="no-mobile">System</span>
                    <v-icon>mdi-cellphone-link</v-icon>
                </v-tab>
                <v-tab class="ma-0" href="#sensores">
                    <span class="no-mobile">Sensors</span>
                    <v-icon>mdi-list-status</v-icon>
                </v-tab>
                <v-tab class="ma-0" href="#configuracion">
                    <span class="no-mobile">Operations</span>
                    <v-icon>mdi-cog</v-icon>
                </v-tab>
                <v-tab class="ma-0" href="#mapas">
                    <span class="no-mobile">Map</span>
                    <v-icon>mdi-map-marker-radius</v-icon>
                </v-tab>
            </v-tabs>
        </template>
    </v-app-bar>

    <!-- <lister v-if="this.$store.state.appbar.currentPage == 'lister'"/>
      <emulator v-else-if="this.$store.state.appbar.currentPage == 'emulador'"/> -->
    <v-main>
        <Nuxt />
    </v-main>
</v-app>
</template>

<script>
import {
    mapMutations
} from "vuex";
import textField from "@/mixins/textField.mixin.js";
import baseUserApiMixin from "@/mixins/baseUserApi.mixin.js";
export default {
    mixins: [baseUserApiMixin, textField],
    data() {
        return {
            varIcon:"",
            eventArr: [],
            contOperations: 0,
            deviceapi: [],
            todo: true,
            devices: [],
            field: null,
            logDialog: false,
            logoutDialog: false,
            valid: false,
            tabActivo: "sistema",
            menu: false,
            mqttClient: null,
            socketConnected: null,
            send: false
        };
    },
    methods: {
        ...mapMutations({
            sendText: "appbar/setFilter",
            setTab: "appbar/setTab",
        }),
        routerdialog() {
            localStorage.checkbox = false;
            this.$router.push({
                path: "/",
            });
        },
        routerlister(id) {
            this.tabActivo = "sistema";
            this.$router.push({
                path: "/listerpage",
            });
        },
        search() {
            this.sendText({
                text: this.field,
            });
        },
        sendResponse(string, eventObj) {
            let operationResponse = {
                operation : {
                    response : {}
                }
            }
            operationResponse.operation.response.name = eventObj.operation.request.name
            operationResponse.operation.response.timestamp = eventObj.operation.request.timespamp
            operationResponse.operation.response.id = eventObj.operation.request.id
            operationResponse.operation.response.resultCode = string

            setTimeout(() => {
                this.mqttClient.send(JSON.stringify(this.operationResponse))
            }, 1000)
        },
        deviceConnect() {
            // try {
            //     // this.mqttClient = mqtt.connect('mqtt://preproapi.opengate.es:1883',
            //     //     {
            //     //         clientId: newVal,
            //     //         username: newVal,
            //     //         password: this.userData.apiKey
            //     //     })
            //     //
            //     // this.mqttClient.on('connect', () => {
            //     // console.log('connected')
            //     // debugger
            //     // this.mqttClient.subscribe('odm/request/'+ newVal, {}, (err) => {
            //     // if (!err) {
            //     // console.log('hola')
            //     // }
            //     // })
            //     // })

            //     // client.on('message', function (topic, message) {
            //     // // message is Buffer
            //     // console.log(message.toString())
            //     // client.end()
            //     // })

            //     // cierro si hubiera alguna conexión abierta
            //     if (this.mqttClient && this.mqttClient.close) {
            //         this.mqttClient.close();
            //     }

            //     this.mqttClient = new WebSocket(
            //         "ws://api.opengate.es/south/v80/sessions/" + this.deviceId + "?X-ApiKey=" + this.apiUsuario.apiKey
            //     );

            //     this.mqttClient.onmessage = (event) => {
            //         console.log(event);

            //         if (event.data) {
            //             this.contOperations++
            //             const eventObj = JSON.parse(event.data);

            //             if (localStorage && localStorage.operationsConfig) {
            //                 let operaConfigs = JSON.parse(localStorage.operationsConfig);
            //                 this.date = new Date()
            //                 this.time = this.date.getHours() + ":" + this.date.getMinutes()

            //                 if (operaConfigs[this.deviceId]) {
            //                     if (
            //                         operaConfigs[this.deviceId][eventObj.operation.request.name] &&
            //                         operaConfigs[this.deviceId][eventObj.operation.request.name].enabled
            //                     ) {
            //                         let functionCode =
            //                             "(function(operaData) {console.log(operaData);" +
            //                             operaConfigs[this.deviceId][eventObj.operation.request.name]
            //                             .code +
            //                             "})";

            //                         const functionObj = eval(functionCode)

            //                         try {
            //                             functionObj(eventObj.operation.request)
            //                             this.sendResponse("SUCCESSFUL", eventObj)

            //                             this.eventArr.push({
            //                                 type: 'SUCCESSFUL',
            //                                 description: eventObj.operation.request.name,
            //                                 devId: this.deviceId,
            //                             })
            //                         } catch (error) {
            //                             console.error(error)
            //                         }

            //                     } else if (operaConfigs[this.deviceId][eventObj.operation.request.name]) {
            //                         this.sendResponse("NOT_SUPPORTED", eventObj)
            //                         console.error(
            //                             "no soportada la operación " + eventObj.operation.request.name
            //                         )

            //                         // poner fecha de operación
            //                         this.eventArr.push({
            //                             type: 'NOT_SUPPORTED',
            //                             description: eventObj.operation.request.name,
            //                             devId: this.deviceId,
            //                         })
            //                     } else {
            //                         this.sendResponse("CANCELLED", eventObj)
            //                         console.error(failure)
            //                         // poner fecha de operación
            //                         this.eventArr.push({
            //                             type: 'CANCELLED',
            //                             description: eventObj.operation.request.name,
            //                             devId: this.deviceId,
            //                         })
            //                     }
            //                 } else {
            //                     this.sendResponse("NOT_SUPPORTED", eventObj)
            //                     console.error("NOT_SUPPORTED")

            //                     // poner fecha de operación
            //                     this.eventArr.push({
            //                         type: 'NOT_SUPPORTED',
            //                         description: eventObj.operation.request.name,
            //                         devId: this.deviceId,
            //                         dateTime: new Date().toLocaleString()
            //                     })
            //                 }
            //             } else {
            //                 this.sendResponse("NOT_CONFIGURED", eventObj)

            //                 this.eventArr.push({
            //                     type: 'NOT_CONFIGURED',
            //                     description: eventObj.operation.request.name,
            //                     devId: this.deviceId,
            //                     dateTime: new Date().toLocaleString()
            //                 })
            //             }
            //         }
            //     };

            //     this.mqttClient.onopen = (event) => {
            //         console.log(event)
            //         console.log("Successfully connected to the echo websocket server...")
            //         this.contOperations++
            //         this.socketConnected = true

            //         this.eventArr.push({
            //             type: 'Connect',
            //             devId: this.deviceId,
            //             dateTime: new Date().toLocaleString()
            //         })
            //     }

            //     this.mqttClient.onclose = (event) => {
            //         this.contOperations++

            //         this.eventArr.push({
            //             type: 'Disconnect',
            //             devId: this.deviceId,
            //             dateTime: new Date().toLocaleString()
            //         })

            //         if (this.socketConnected) {
            //             // reiniciar conexión
            //             this.deviceConnect()
            //         }
            //     }

            //     this.mqttClient.onerror = (event) => {
            //         this.contOperations++

            //         if (this.socketConnected) {
            //             // reiniciar conexión
            //             this.deviceConnect()
            //         }

            //         this.eventArr.push({
            //             type: 'Error',
            //             devId: this.deviceId,
            //             dateTime: new Date().toLocaleString()
            //         })
            //     }

            //     // this.mqttClient.onConnectionLost = () => {
            //     //     console.log('desconectao')
            //     // };
            //     // this.mqttClient.onMessageArrived = (msg) => {
            //     //     console.log(msg)
            //     // };

            //     // this.mqttClient.connect(options);
            // } catch (connError) {
            //     this.mqttClient = null;
            //     this.socketConnected = false
            //     this.contOperations++
            //     console.error(connError);
            //     this.eventArr.push({
            //         type: 'Error',
            //         devId: this.deviceId,
            //         dateTime: new Date().toLocaleString(),
            //         description: conError
            //     })
            //     if (this.mqttClient && this.mqttClient.close) {
            //         this.mqttClient.close();
            //     }
            // }
        }
    },
    computed: {
        listIcon(){
            if(this.eventArr.type === 'Connect'){
               return this.varIcon = "mdi-lan-connect"
            }else if(this.eventArr.type ==='Disconnect'){
               return this.varIcon = "mdi-lan-disconnect"
            }else{
              return  this.varIcon = "hola" + this.eventArr.type
            }
 /*             'Connect'" >mdi-lan-connect
'Disconnect'">mdi-lan-disconnect
'SUCCESSFUL'">mdi-thumb-up
'NOT_SUPPORTED'">mdi-thumb-down
'CANCELLED'">mdi-thumb-down
'NOT_CONFIGURED'">mdi-thumb-down */
        },
        operationCount() {
            if (this.event) {
                contOperations++;
            }
        },
        isEmulatorConnected() {
            return this.deviceId && this.socketConnected;
        },
        deviceId() {
            return this.$route.query.id;
        },
        render() {
            if (this.$store.state.appbar.currentPage === "lister") {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        /*      this.eventAux = localStorage.eventName
         */
    },
    created() {
        if (!this.$api) {
            this.$router.push({
                path: "/",
            });
        }
    },
    watch: {
        tabActivo: {
            handler(newVal, oldVal) {
                this.setTab({
                    tab: this.tabActivo,
                });
            },
        },
        deviceId(newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                this.eventArr.splice(0, this.eventArr.length)
                this.contOperations = 0
                this.deviceConnect()
            } else {
                // if (this.mqttClient && this.mqttClient.disconnect) {
                //     this.mqttClient.disconnect()
                // }
                this.socketConnected = false
                if (this.mqttClient && this.mqttClient.close) {
                    this.mqttClient.close();
                }
            }
        },
        tab: function () {
            this.tabActivo = this.tab;
        }
    },
};
</script>

<style scoped>
.menu,
.mobile {
    display: none;
}

.no-mobile {
    display: block;
}

@media only screen and (max-width: 768px) {
    .nav_item {
        display: none;
    }

    .menu,
    .mobile {
        display: block;
    }

    .no-mobile {
        display: none;
    }
}

.logout {
    z-index: 9999;
}
</style>
