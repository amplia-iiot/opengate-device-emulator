<template>
  <div id="app">
    <v-app id="inspire">
      <v-form
        @submit.prevent="enviar()"
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-autocomplete
          style="color: red"
          class="items"
          v-model="Servidor"
          :items="items"
          label="Servidor"
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
export default {
  name: "formulario",

  data() {
    return {
      name: "nombre",
      pass_user: ["Angel11111111", "Chema22222222", "Diego33333333", "Monica44444444"],
      valid: true,
      
      Servidor: null,
      items: [
        "Servidor 1",
        "Servidor 2",
        "Servidor 3",
        "Servidor 4",
        "Servidor test",
      ],
      checkbox: false,
      /* Contraseña */
      show1: false,
      show2: true,
      password: "",
      
    };
  },

  methods: {
    enviar() {
      if (this.checkbox == true) {
        localStorage.setItem("nombre", this.name);
        localStorage.setItem("servidor", this.Servidor);
        localStorage.setItem("contraseña", this.password);
      } else{
      localStorage.nombre = "";
      localStorage.Servidor = "";
      localStorage.password = "";
      }

      if (this.pass_user.includes(this.name + this.password) && ((this.nombre + this.password) != "test00000000")) {
        alert("Bienvenido");
        this.$router.push("/listerpage"); /*Aqui deberia ir la ruta del buscador*/ 
      } else {
        alert("Constraseña o Usuario Incorrectos!");
      }
      console.log(
        "Nombre " +
          this.name +
          " Servidor: " +
          this.Servidor +
          " Contraseña: " +
          this.password +
          " Recordar: " +
          this.checkbox
      );
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  mounted() {
    if (localStorage.nombre) {
      this.name = localStorage.nombre;
      this.password = localStorage.contraseña;
      this.Servidor = localStorage.Servidor;
    }
  },
  watch: {
    name(newName) {
      localStorage.nombre = newName;
    },
  },
};
</script>

<style></style>
