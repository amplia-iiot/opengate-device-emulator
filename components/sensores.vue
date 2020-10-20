<template>
  <v-app>
    <br />
    <v-form>
      <v-form ref="form" v-model="valid">
        <v-jsf v-model="model" :schema="schema" :options="options" />
      </v-form>
      <v-btn :disabled="disabled1" @click="botonEditar" class="btn btn-primary"
        >Editar</v-btn
      >
      <v-btn :disabled="disabled2" @click="botonCambiar" class="btn btn-danger"
        >Cambiar</v-btn
      >
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
      model: {
        temperatura: "",
        ram: "",
        hdd: "",
        bateria: "",
        id: 1,
      },

      models: [
        {
          temperatura: "76ºC",
          ram: "2,4GB",
          hdd: "45GB",
          bateria: "43%",
          id: 1234,
        },
        {
          temperatura: "90ºC",
          ram: "1,4GB",
          hdd: "366GB",
          bateria: "92%",
          id: 4567,
        },
        {
          temperatura: "45ºC",
          ram: "0,4GB",
          hdd: "12GB",
          bateria: "12%",
          id: 8901,
        },
        {
          temperatura: "34ºC",
          ram: "4,4GB",
          hdd: "87GB",
          bateria: "77%",
          id: 2345,
        },
        {
          temperatura: "105ºC",
          ram: "1GB",
          hdd: "1GB",
          bateria: "12%",
          id: 6789,
        },
      ],

      schema: {
        type: "object",
        properties: {
          temperatura: {
            type: "string",
            title: "Temperature",
            readOnly: true,
          },
          ram: {
            type: "string",
            title: "RAM available",
            readOnly: true,
          },
          hdd: {
            type: "string",
            title: "HDD available",
            readOnly: true,
          },
          bateria: {
            type: "string",
            title: "Battery available",
            readOnly: true,
          },
          id: {
            type: "integer",
            title: "id",
            readOnly: true,
          },
        },
      },
      options: {},

      only: true,
      disabled1: false,
      disabled2: true,
    };
  },
  created: function () {
    this.models.forEach((element) => {
      if (element.id == this.$route.query.id) {
        this.model.temperatura = element.temperatura;
        this.model.ram = element.ram;
        this.model.hdd = element.hdd;
        this.model.bateria = element.bateria;
        this.model.id = element.id;
      }
    });
  },

  methods: {
    botonEditar: function () {
      (this.schema.properties.temperatura.readOnly = false),
        (this.schema.properties.ram.readOnly = false),
        (this.schema.properties.hdd.readOnly = false),
        (this.schema.properties.bateria.readOnly = false),
        (this.disabled2 = false),
        (this.disabled1 = true);
    },
    botonCambiar: function () {
      (this.disabled2 = true),
        (this.disabled1 = false),
        (this.schema.properties.temperatura.readOnly = true),
        (this.schema.properties.ram.readOnly = true),
        (this.schema.properties.hdd.readOnly = true),
        (this.schema.properties.bateria.readOnly = true)
    },
  },
};
</script>