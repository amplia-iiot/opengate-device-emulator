<template>
  <div>
    <v-app>
      <h3>Configuracion</h3>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header> Formatear </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-switch
              v-model="config"
              :label="`¿Configuracion?: ${config.toString()}`"
            ></v-switch>
            <v-switch
              v-model="datos"
              :label="`¿Datos?: ${datos.toString()}`"
            ></v-switch>
            <v-switch
              v-model="todo"
              :label="`¿Todo?: ${todo.toString()}`"
            ></v-switch>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-switch v-model="update" :label="`¿Actualizar Software?`"></v-switch>
      <v-row>
        <v-col cols="4" md="1">
          <v-text-field v-model="nombre" label="Nombre"></v-text-field>
        </v-col>
        <v-col cols="3" md="1">
          <v-text-field v-model="fecha" label="Fecha"></v-text-field>
        </v-col>
        <v-col cols="2" md="1">
          <v-text-field v-model="hora" label="Hora"></v-text-field>
        </v-col>
      </v-row>
    </v-app>
  </div>
</template>
<script>
export default {
  name: "configuracion",
  data() {
    return {
      config: true,
      datos: false,
      todo: false,
      update: false,
      nombre : "Chema",
      fecha: "1/10/2020",
      hora: "08:00 AM",
    };
  },
};
</script>
