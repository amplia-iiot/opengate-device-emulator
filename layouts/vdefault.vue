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
                <template v-slot:activator="{ on, attrs }">
                    <v-btn text v-bind="attrs" v-on="on">
                        <v-badge :content="contOperations" :value="contOperations" color="error">
                            <v-icon v-if="isEmulatorConnected" color="success">mdi-lan-connect</v-icon>
                            <v-icon v-else color="error">mdi-lan-disconnect</v-icon>
                        </v-badge>
                    </v-btn>
                </template>
                <!-- Comiezo del DIALOG -->
                <v-card>
                    <v-card-title class="headline grey lighten-2">
                        Events
                    </v-card-title>

                    <v-card-text>
                        <!-- Lista de tareas -->
                        <v-list>
                            <v-list-item v-for="(item, i) in eventAux.split(':')" :key="i" @click="() => {}">
                                <v-list-item-title>{{ item }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                        <!-- Lista de tareas, DeviceId, DateTime, Type, Description falla -->
                        <v-list two-line>
                        <v-list-item-group
                            v-model="selected"
                            multiple
                        >
                            <template v-for="(item, index) in eventArr">
                            <v-list-item :key="item.type">
                                <template>
                                <v-list-item-content>
                                    <v-list-item-title v-text="item.type"></v-list-item-title>

                                    <v-list-item-subtitle
                                    class="text--primary"
                                    v-text="item.devId"
                                    ></v-list-item-subtitle>

                                    <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <v-list-item-action-text v-text="item.dateTime"></v-list-item-action-text>
                                </v-list-item-action>
                                </template>
                            </v-list-item>

                            <v-divider
                                v-if="index < eventArr.length - 1"
                                :key="index"
                            ></v-divider>
                            </template>
                        </v-list-item-group>
                        </v-list>                        
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="logDialog = false">
                            <v-icon dark left>
                                mdi-arrow-left
                            </v-icon>
                        </v-btn>
                    </v-card-actions>
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
    <v-content>
        <Nuxt />
    </v-content>
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
            selected:[2],
            date: "",
            time:"",
            devId:"",
            eventAux: "",
            eventArr:[],
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
            operationResponse: {
                operation: {
                    response: {}
                }
            },
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
            this.operationResponse.operation.response.name = eventObj.operation.request.name
            this.operationResponse.operation.response.timestamp = eventObj.operation.request.timespamp
            this.operationResponse.operation.response.parameters = eventObj.operation.request.parameters
            this.operationResponse.operation.response.id = eventObj.operation.request.id
            this.operationResponse.operation.response.resultCode = string

            setTimeout(() => {
                this.mqttClient.send(JSON.stringify(this.operationResponse))
            }, 1000)
        }
    },
    computed: {
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
                try {
                    // this.mqttClient = mqtt.connect('mqtt://preproapi.opengate.es:1883',
                    //     {
                    //         clientId: newVal,
                    //         username: newVal,
                    //         password: this.userData.apiKey
                    //     })
                    //
                    // this.mqttClient.on('connect', () => {
                    // console.log('connected')
                    // debugger
                    // this.mqttClient.subscribe('odm/request/'+ newVal, {}, (err) => {
                    // if (!err) {
                    // console.log('hola')
                    // }
                    // })
                    // })

                    // client.on('message', function (topic, message) {
                    // // message is Buffer
                    // console.log(message.toString())
                    // client.end()
                    // })

                    this.mqttClient = new WebSocket(
                        "ws://api.opengate.es/south/v80/sessions/" +
                        newVal +
                        "?X-ApiKey=" +
                        this.apiUsuario.apiKey
                    );

                    this.mqttClient.onmessage = (event) => {
                        console.log(event);

                        this.contOperations++

                        if (localStorage && localStorage.operationsConfig) {
                            let operaConfigs = JSON.parse(localStorage.operationsConfig);

                            if (event.data) {
                                const eventObj = JSON.parse(event.data);
                                localStorage.eventName = ""
                                localStorage.eventName += eventObj.operation.request.name + "," + this.deviceId + ":"
                                this.eventAux += localStorage.eventName
                                this.eventArr.splice(0, this.eventArr.length)
                                    this.date = new Date()
                                    this.time = this.date.getHours() + ":" + this.date.getMinutes()
                                this.eventArr.push({
                                    type:'Connect',
                                    devId: this.deviceId,
                                    dateTime: this.time,
                                    description: this.eventObj.operation.request.name
                                })
                                if (operaConfigs[this.deviceId]) {

                                    if (
                                        operaConfigs[this.deviceId][eventObj.operation.request.name] &&
                                        operaConfigs[this.deviceId][eventObj.operation.request.name]
                                        .enabled
                                    ) {
                                        let functionCode =
                                            "(function(operaData) {console.log(operaData);" +
                                            operaConfigs[this.deviceId][eventObj.operation.request.name]
                                            .code +
                                            "})";

                                        const functionObj = eval(functionCode)

                                        try {
                                            functionObj(eventObj.operation.request)
                                            this.sendResponse("SUCCESSFUL", eventObj)
                                                this.eventArr.splice(0, this.eventArr.length)

                                                this.eventArr.push({
                                                    type:'SUCCESSFUL',
                                                    description: this.eventObj.operation.request.name,
                                                    devId: this.deviceId,
                                                })                                            
                                        } catch (error) {
                                            console.error(error)
                                        }

                                    } else if (operaConfigs[this.deviceId][eventObj.operation.request.name]) {
                                        this.sendResponse("NOT_SUPPORTED", eventObj)
                                        console.error(
                                            "no soportada la operación " + eventObj.operation.request.name
                                        )
                                        this.eventArr.splice(0, this.eventArr.length)
                                       
                                        this.eventArr.push({
                                            type:'NOT_SUPPORTED',
                                            description: this.eventObj.operation.request.name,
                                            devId: this.deviceId,
                                        })                                        
                                    } else {
                                        this.sendResponse("CANCELLED", eventObj)
                                        console.error(failure)
                                        this.eventArr.splice(0, this.eventArr.length)

                                        this.eventArr.push({
                                            type:'CANCELLED',
                                            description: this.eventObj.operation.request.name,
                                            devId: this.deviceId,
                                        })
                                    }
                                } else {
                                    this.sendResponse("NOT_SUPPORTED", eventObj)
                                    console.error("NOT_SUPPORTED")
                                    this.eventArr.splice(0, this.eventArr.length)

                                    this.eventArr.push({
                                        type:'NOT_SUPPORTED',
                                        description: this.eventObj.operation.request.name,
                                        devId: this.deviceId,
                                    })                                    
                                }
                            }
                        } else {
                            this.sendResponse("NOT_SUPPORTED", eventObj)
                        this.eventArr.splice(0, this.eventArr.length)

                        this.eventArr.push({
                            type:'NOT_SUPPORTED',
                            description: this.eventObj.operation.request.name,
                            devId: this.deviceId,
                        })                            
                        }
                        this.eventArr.splice(0, this.eventArr.length)
                        
/*                         this.eventArr.push({
                            type:'Connect',
                            description: this.eventObj.operation.request.name,
                            devId: this.deviceId,
                        }) */

                    };

                    const mqttCopy = this.mqttClient;
                    this.mqttClient.onopen = (event) => {
                        console.log(event)
                        console.log("Successfully connected to the echo websocket server...")
                        this.contOperations++
                        this.socketConnected = true

                        this.eventArr.splice(0, this.eventArr.length)
                            this.date = new Date()
                            this.time = this.date.getHours() + ":" + this.date.getMinutes()
                        this.eventArr.push({
                            type:'Connect',
                            devId: this.deviceId,
                            dateTime: this.time
                         })
                    }

                    this.mqttClient.onclose = (event) => {
                        this.contOperations = 0

                        if (this.socketConnected) {
                            // reiniciar conexión
                        }
/*                         this.eventArr.splice(0, this.eventArr.length)
 */                            this.date = new Date()
                            this.time = this.date.getHours() + ":" + this.date.getMinutes()
                         this.eventArr.push({

                            type:'Disconnect',
                            devId: this.deviceId,
                            dateTime: this.time
                        })                       
                    }

                    // this.mqttClient.onConnectionLost = () => {
                    //     console.log('desconectao')
                    // };
                    // this.mqttClient.onMessageArrived = (msg) => {
                    //     console.log(msg)
                    // };

                    // this.mqttClient.connect(options);
                } catch (connError) {
                    this.mqttClient = null;
                    this.socketConnected = false
                    console.error(connError);
                }
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
        },
        eventAux: function () {
            if (localStorage.eventName) {
                this.operationEvent = localStorage.eventName.split(",")

                this.propEvent = this.operationEvent
            }

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
