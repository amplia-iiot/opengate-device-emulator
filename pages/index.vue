<template>
  <div id="app">
    <v-app id="inspire">
      {{apiUsuario}}
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-autocomplete
          style="color: red"
          class="items"
          v-model="servidor"
          :items="items"
          label="servidor"
          required
        ></v-autocomplete>
        <v-text-field
          v-model="name"
          :counter="12"
          label="Nombre"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Contraseña"
          hint="Min 8 caracteres"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>

        <v-checkbox
          color="success"
          v-model="checkbox"
          label="¿Recordar en este equipo?"
        ></v-checkbox>

        <v-btn color="success" class="mr-4" @click="enviar"> Enviar </v-btn>
        <v-btn color="error" class="mr-4" @click="reset"> Vaciar Campos </v-btn>
      </v-form>
    </v-app>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import baseUserApiMixin from '@/mixins/baseUserApi.mixin.js'

export default {
  name: "formulario",
  mixins: [baseUserApiMixin],
  data() {
    return {
      name: "nombre",
      pass_user: ["Angel11111111", "Chema22222222", "Diego33333333", "Monica44444444"],
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
        setOgapi: 'ogapi/setOgapi'
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
          alert("Bienvenido");

          if (this.checkbox == true) {
            localStorage.setItem("nombre", this.name)
            localStorage.setItem("servidor", this.servidor)
            localStorage.setItem("contraseña", this.password)
          } else{
            delete localStorage.nombre
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
    
      // if (this.pass_user.includes(this.name + this.password) && ((this.nombre + this.password) != "test00000000")) {
      //   alert("Bienvenido");
      //   this.$router.push("/listerpage"); /*Aqui deberia ir la ruta del buscador*/ 
      // } else {
      //   alert("Constraseña o Usuario Incorrectos!")
      // }
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
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    if(this.$store.state.ogapi.apiKey) this.$store.state.ogapi.apiKey= null
    if (localStorage && localStorage.nombre) {
      this.name = localStorage.nombre
      this.password = localStorage.password
      this.servidor = localStorage.servidor
    }
  },
  watch: {
    // name(newName, oldName) {
    //   localStorage.nombre = newName;
    // }
  },
};
</script>

<style></style>
