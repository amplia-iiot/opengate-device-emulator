<template>
  <v-app id="inspire">
    <v-card elevation="24" style="max-width:50%;left:50%;transform:translate(-50%, -50%);top:50%;"> 
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation> 
          <v-autocomplete
            style="color: red; "
            class="items"
            v-model="servidor"
            :items="items"
            label="servidor"
            required
          ></v-autocomplete>
          <v-text-field
            style=""
            v-model="name"
            label="Nombre"
          ></v-text-field>
          <v-text-field
            style=""
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Contraseña"
            hint="Min 8 caracteres"
            counter
            @click:append="show1 = !show1"
            @keyup.enter="enviar"
          ></v-text-field>
          <v-checkbox
        v-model="checkbox"
        :label="`Recordar datos`"
      ></v-checkbox>
          <v-btn color="success" class="mr-4" @click="enviar"> Enviar </v-btn>
          <v-btn color="error" class="mr-4" @click="reset">
            Vaciar Campos
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import baseUserApiMixin from '@/mixins/baseUserApi.mixin.js'
export default {
  name: "formulario",
  mixins: [baseUserApiMixin],
  layout:"login",
  data() {
    return {
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
        setPage: "appbar/setPage",
        setUser: 'appbar/setUser'
    }),
    async enviar() {
      
      this.setOgapi( {
        config: {
          servidor: this.servidor
        }
      })
      try {
        const response = await this.$api.newUserFinder().findByEmailAndPassword(this.name, this.password)
        if (response && response.data) {
          if (this.checkbox) {
            localStorage.name = this.name
            localStorage.servidor = this.servidor
            localStorage.password = this.password
          } else{
            delete localStorage.name
            delete localStorage.servidor
            delete localStorage.password
          }
          this.setOgapi( {
            config: {
              user: response.data,
              servidor: this.servidor
            }
          })
          this.$router.push("/listerpage") /*Aqui deberia ir la ruta del buscador*/  
        } 
      } catch (errPeticion) {
        console.error(errPeticion)
        alert("Constraseña o Usuario Incorrectos!")
        delete localStorage.nombre
        delete localStorage.servidor
        delete localStorage.password
      
      }

      console.log(
        "Nombre " +
          this.name +
          " servidor: " +
          this.servidor +
          " Contraseña: " +
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
  },
  mounted() {
    if(this.$store.state.ogapi.apiKey) this.$store.state.ogapi.apiKey= null
    if (localStorage && localStorage.name) {
      this.name = localStorage.name
      this.password = localStorage.password
      this.servidor = localStorage.servidor
      
    }
    
   
    this.setPage({
      page: "lister"
    })
  },
  
  watch: {

  },
};
</script>

<style scoped>
.login-window {

  max-width: 40%;
}
</style>