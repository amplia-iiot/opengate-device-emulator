<template>
  <div>
    <h2>Geolocalización del dispositvo</h2>
    <v-card elevation="14">
      <v-sheet
        :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
        class="pa-3"
      >
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-sheet>

      <v-row>
        <v-col cols="4" md="1">
          <v-text-field
            disable
            v-model="cordenadas"
            label="Cordenadas(Altitud/latitud)"
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="1">
          <v-text-field
            v-model="tiempo_activo"
            label="Tiempo Activo(horas)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "mapas",
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
  data() {
    return {
      cordenadas: " 40.453206, -3.688173",
      tiempo_activo: "1440",
      date: null,
      trip: {
        name: "",
        location: null,
        start: null,
        end: null,
      },
    };
  },
};
</script>