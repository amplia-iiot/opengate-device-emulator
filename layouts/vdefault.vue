<template>
<v-app id="inspire">
    <v-app-bar extended app color="primary" dark elevate-on-scroll>
        <v-app-bar-nav-icon @click="routerlister" v-if="deviceId">
            <v-icon> mdi-chevron-left </v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>
            {{
          deviceId
            ? "" + deviceId + " Emulator"
            : "Select device to emulate"
        }}
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
            <v-btn text>
                <v-badge content="3" color="error">
                    <v-icon color="success">mdi-lan-connect</v-icon>
                </v-badge>
            </v-btn>
            <!-- <v-btn text>
          <v-icon color="error">mdi-lan-disconnect</v-icon>
        </v-btn> -->
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
                            <v-list-item-title>{{ this.$store.state.appbar.user }}</v-list-item-title>
                            <v-list-item-subtitle>User</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-dialog v-model="dialog" persistent>
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
                                <v-btn color="green darken-1" text @click="dialog = false">
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
            deviceapi: [],
            todo: true,
            devices: [],
            field: null,
            dialog: false,
            valid: false,
            tabActivo: "sistema",
            menu: false,
            mqttClient: null
        };
    },
    methods: {
        ...mapMutations({
            sendText: "appbar/setFilter",
            setTab: "appbar/setTab",
        }),
        routerdialog() {
          localStorage.checkbox = false
            this.$router.push({
                path: "/"
            });
        },
        routerlister(id) {
            this.tabActivo = 'sistema'
            this.$router.push({
                path: "/listerpage",
            });
        },
        search() {
            this.sendText({
                text: this.field,
            });
        }
    },
    computed: {
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
    created() {

        if (!this.$api) {
            this.$router.push({
                path: "/"
            })
        }

    },
    watch: {
        tabActivo: {
            handler(newVal, oldVal) {
                this.setTab({
                    tab: this.tabActivo,
                });
            }
        },
        deviceId(newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                try {
                      // this.mqttClient = mqtt.connect('mqtt://api.opengate.es:1883',
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


                    debugger
                    this.mqttClient = new WebSocket('ws://api.opengate.es/south/v80/sessions/' + newVal + '?X-ApiKey=' + this.userData.apiKey)

                    this.mqttClient.onmessage = function(event) {
                        debugger
                        console.log(event);
                    }

                    this.mqttClient.onopen = function(event) {
                        console.log(event)
                        console.log("Successfully connected to the echo websocket server...")
                    }

                    // this.mqttClient = new Paho.Client('mqtt://api.opengate.es', 1883, '', newVal);
                    //document.write("connecting to "+ host);
                    // var options = {
                    //     userName: newVal,
                    //     password: this.userData.apiKey,
                    //     onConnected = () => {
                    //         console.log('conectao')
                    //     }
                    // }

                    // this.mqttClient.onConnectionLost = () => {
                    //     console.log('desconectao')
                    // };
                    // this.mqttClient.onMessageArrived = (msg) => {
                    //     console.log(msg)
                    // };

                    // this.mqttClient.connect(options);
                }catch(connError) {
                    this.mqttClient = null
                    console.error(connError)
                }
                
            } else {
                // if (this.mqttClient && this.mqttClient.disconnect) {
                //     this.mqttClient.disconnect()
                // }
                if (this.mqttClient && this.mqttClient.close) {
                    this.mqttClient.close()
                }
            }
        },
        tab: function(){
            this.tabActivo = this.tab
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
