<template>
<v-app id="inspire" height=700> 
    <v-card class="loginCard" elevation="24" >
      <v-list-item three-line class="login-extend" >
        <v-list-item-content>
          <div class="titleEmulator">
            EMULATOR DEVICE
          </div>
            <p class="subtitleP">A tool with which you can emulate multiple devices. </p>
                
            <p class="subtitleP">Interact with them, receiving and sending data.</p> 
                
            <p class="subtitleP"></p>
          <v-list-item-subtitle> 
              <a :ref="url"> amplia)))</a>
          </v-list-item-subtitle>
        </v-list-item-content>
  
        <v-list-item-avatar
          tile
          size="50%"
          class="login-extend"
        >
            <v-card-text >
                <v-form ref="form" v-model="valid" lazy-validation class="formLogin">
                    <!-- <v-autocomplete style="color: red; " class="items" v-model="servidor" :items="items" label="servidor" required></v-autocomplete> -->
                    <v-text-field v-model="name" label="Name"></v-text-field>
                    <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" name="input-10-1" label="password" counter @click:append="show1 = !show1" @keyup.enter="enviar"></v-text-field>
                    <v-checkbox v-model="checkbox" :label="`Remember me`"></v-checkbox>
                    <v-btn color="primary" class="mr-4" @click="enviar"> Login </v-btn>
                </v-form>
            </v-card-text>        
        </v-list-item-avatar>
      </v-list-item>
            <v-card-text class="loginPc" >
                <v-form ref="form" v-model="valid" lazy-validation>
                    <!-- <v-autocomplete style="color: red; " class="items" v-model="servidor" :items="items" label="servidor" required></v-autocomplete> -->
                    <v-text-field v-model="name" label="Name"></v-text-field>
                    <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" name="input-10-1" label="password" counter @click:append="show1 = !show1" @keyup.enter="enviar"></v-text-field>
                    <v-checkbox v-model="checkbox" :label="`Remember me`"></v-checkbox>
                    <v-btn color="primary" class="mr-4" @click="enviar"> Login </v-btn>
                </v-form>
            </v-card-text>        

    </v-card>
</v-app>

</template>

<script>
import {
    mapMutations
} from 'vuex'
import baseUserApiMixin from '@/mixins/baseUserApi.mixin.js'
export default {
    name: "formulario",
    mixins: [baseUserApiMixin],
    layout: "login",
    data() {
        return {
            valor:"",
            url: "https://www.amplia-iiot.com/",
            name: "",
            valid: true,

            servidor: null,
            items: [
                "servidor 1",
                "servidor 2",
                "servidor 3",
                "servidor 4",
                "servidor test",
            ],
            checkbox: false,
            /* Contraseña */
            show1: false,
            show2: true,
            password: "",

        };
    },

    methods: {
        ...mapMutations({
            setOgapi: 'ogapi/setOgapi',
            setOgapiKey: 'ogapi/setOgapiKey',
            setUser: 'appbar/setUser'
        }),
        async enviar() {

            this.setOgapi({
                config: {
                    servidor: this.servidor
                }
            })
            try {
                const response = await this.$api.newUserFinder().findByEmailAndPassword(this.name, this.password)
                if (response && response.data) {
                    this.setOgapi({
                        config: {
                            user: response.data,
                            servidor: this.servidor
                        }
                    })
                    if (this.checkbox) {
                        localStorage.name = this.name
                        localStorage.servidor = this.servidor
                        localStorage.checkbox = this.checkbox
                        localStorage.api = response.data.apiKey
                        console.log(response.data)

                    } else {
                        delete localStorage.name
                        delete localStorage.servidor
                        delete localStorage.checkbox
                    }

                    this.$router.push("/listerpage") /*Aqui deberia ir la ruta del buscador*/
                }
            } catch (errPeticion) {
                console.error(errPeticion)
                alert("Constraseña o Usuario Incorrectos!")
                delete localStorage.name
                delete localStorage.servidor
                delete localStorage.password

            }

            console.log(
                " Name " +
                this.name +
                " servidor: " +
                this.servidor +
                " Password: " +
                this.password +
                " Recordar: " +
                this.checkbox
            )
            this.setUser({
                email: this.name
            })
        },
        reset() {
            this.$refs.form.reset();
        },

        itemMostrar() {
            if ($(window).width() < 720) {
                 return this.valor = "auto";
            } else {
                 return this.valor = "50%";
            }
        },
    },
    async mounted() {
        if (localStorage.checkbox === "true" && localStorage.api && localStorage.name ) {
          

                this.setOgapiKey({
                    config: {
                        key: localStorage.api,
                        servidor: localStorage.servidor
                    }
                })
              try {
                const response = await this.$api.newUserFinder().findByEmail(localStorage.name)
                if (response && response.data) {
                    response.data.apiKey = localStorage.api
                    this.setOgapi({
                        config: {
                            user: response.data,
                            servidor: this.servidor
                        }
                    })
                    this.setUser({
                email: localStorage.name
            })
                    this.$nextTick(()=>this.$router.push("/listerpage")) /*Aqui deberia ir la ruta del buscador*/
                }
            } catch (errPeticion) {
                console.error(errPeticion)
                alert("Constraseña o Usuario Incorrectos!")
                delete localStorage.name
                delete localStorage.servidor
                delete localStorage.password
                delete localStorage.api

            }

            
        }

       
        
    },

    watch: {

    },
};
</script>

<style scoped>
.subtitleP{
    font-family: Consolas;
    color: black;
}
.titleEmulator{
    font-size:  200%;
    font-family: Consolas;
    color:black;
}
#inspire {
    background-image: url("https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1493x1920/bf0e3981056465dd5e3b18249f063f48/photo-1580691746056-4badd831b86e.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    
}
.login-window {

    max-width: 40%;
}
.loginCard{
    opacity: 0.95;
    max-width:50%;
    left:50%;
    transform:translate(-50%, -50%);
    top:50%;
    height:40%;
    
}
.loginPc{
    display: none;
}

@media only screen and (max-width: 768px) {
    .loginPc{
    display: block
}
    .formLogin{
        max-width: 100%;
    }

    .nav_item {
        display: none;
    }

    .mobile {
        display: block;
    }

    .no-mobile {
        display: none;
    }
    .login-extend{
        display: none;
    }
    .loginCard {
        max-width: 100%;       

    }

}
</style>
