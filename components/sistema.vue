<template>
  <v-app>
    <br />
    <v-form>
      <v-form ref="form" v-model="valid">
        <v-jsf
          v-model="model"
          :schema="schema"
          :options="options"
        />
      </v-form>
    </v-form>
  </v-app>
</template>
<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
export default {
  components: {
    VJsf,
  },

  data() {
    return {
      valid: false,
      readOnly: true,
      model:{
          nombre: "",
          id: 1,
      },
        
      models: [
        {
          nombre: "samsung s9",
          id: 1234,
        },
        {
          nombre: "One plus nord",
          id: 4567,
        },
        {
          nombre: "Iphone 11",
          id: 8901,
        },
        {
          nombre: "Xiaomi Redmi",
          id: 2345,
        },
        {
          nombre: "Apple watch",
          id: 6789,
        },
      ],
      

      schema: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            title: "Name",
            readOnly:true
          },
          id: {
            type: "integer",
            title: "id",
            readOnly:true
          },
        },
      },
      options: {},

      only: true,
      disabled1: false,
      disabled2: true,
    };
  },
  created: 
    function() {
      this.models.forEach((element) => {
        if (element.id == this.$route.query.id) {this.model.nombre = element.nombre;this.model.id= element.id}
      });
    },
  
  methods: {},
};
</script>