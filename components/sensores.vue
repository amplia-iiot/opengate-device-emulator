<template>
  <v-app>
    <v-btn
      @click="sendInfo"
      :disabled="!valid"
      fab
      fixed
      bottom
      right
      color="accent"
    >
      <v-icon> mdi-send </v-icon>
    </v-btn>
    <br />

    <v-form ref="form" v-model="valid">
      {{ model }}
      <v-autocomplete
        v-model="innerModel"
        clearable
        multiple
        :items="arrSensors"
        label="sensors"
      >
        <template #selection="{ item }">
          <v-chip
            color="primary"
            close
            @click:close="deleteChip(item, innerModel)"
            >{{ item }}</v-chip
          >
        </template>
      </v-autocomplete>
      <hr />
      <!--       {{ "hola " + listaPrueba }}
 -->
      <v-jsf
        v-if="sensorsSchema"
        v-model="innerModel"
        :schema="sensorsSchema"
        :options="options"
      />
<!--       <v-btn :disabled="disabled1" @click="botonEditar" class="btn btn-primary"
        >Editar</v-btn
      >
      <v-btn :disabled="disabled2" @click="botonCambiar" class="btn btn-danger"
        >Cambiar</v-btn
      > -->
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
  props: {
    sensorsSchema: {
      type: Object,
      default: () => null,
    },
    arrSensors: {
      type: Array,
    },
    model: {
      type: Object,
      default: () => null,
    },
    /*     listaPrueba: {
      type: Array,
    }, */
  },
  watch: {
    model: {
      handler(newVal, oldVal) {
        this.innerModel = newVal;
      },
    },
  },
  data() {
    return {
      valid: false,
      readOnly: true,
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
      innerModel: this.model,


      only: true,
      disabled1: false,
      disabled2: true,
    };
  },
/*   created: function () {
    this.models.forEach((element) => {
      if (element.id == this.$route.query.id) {
        this.model.temperatura = element.temperatura;
        this.model.ram = element.ram;
        this.model.hdd = element.hdd;
        this.model.bateria = element.bateria;
        this.model.id = element.id;
      }
    });
  }, */

  methods: {
    sendInfo() {
      this.sendInfoApi();
    },
    async sendInfoApi() {
      try {
        let mb = this.$api
          .deviceMessageBuilder()
          .withDataStreamVersion("" + new Date().getTime())
        
        // Se pasan los datos del modelo al builder
        for(const prop in this.innerModel){
          console.log(this.model[prop])
          console.log(this.innerModel[prop])
          if (this.innerModel[prop]!=null) {
            let datapointsBuilder = this.$api.datapointsBuilder().withValue(this.innerModel[prop])
            let datastreamBuilder = this.$api.datastreamBuilder().withId(prop)
            mb.withDataStream(datastreamBuilder.withDatapoint(datapointsBuilder))
          }
        }

        // se pasa el id del dispositivo a actualizar
        mb.withId(this.innerModel["device.identifier"])

        // se lanza la petición
        const result = await mb.create()

      } catch (errorApi) {
        console.error(errorApi);
      }
    },


/* deleteChip, elimina las chips creadas */
    deleteChip(itemNeedToRemove, array) {
      for (let i = 0; i < array.length; i += 1) {
        if (array[parseInt(i, 10)] === itemNeedToRemove) {
          array.splice(i, 1);
        }
      }
    },

/*     botonEditar: function () {
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
        (this.schema.properties.bateria.readOnly = true);
    }, */
  },
};
</script>