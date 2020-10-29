<template>
  <v-app-bar extended color="primary" dark >
      <v-app-bar-nav-icon class="ma-2" @click="routerlister" >
          <v-icon> mdi-arrow-left </v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="tittle"  
          >Device {{ deviceId }} - Device Emulator</v-toolbar-title
        >
        <template v-slot:extension>
          <div class="menu">
            <v-app-bar-nav-icon @click="tabsDrawer"></v-app-bar-nav-icon>
              
          </div>

          <v-tabs align-with-title class="nav_item" v-model="tabActivo">
            <v-tab href="#sistema">System</v-tab>
            <v-tab href="#sensores">Sensors</v-tab>
            <v-tab href="#configuracion">Operations</v-tab>
            <v-tab href="#mapas">Map</v-tab>
          </v-tabs>
        </template>
      </v-app-bar>    
         
  
</template>
<script>
import { mapMutations } from "vuex";
import baremulator from "@/components/bar-emulator";
import textField from "@/mixins/baseUserApi.mixin.js";
export default {
  components: {
    baremulator,
  },
  data() {
    return {
      deviceapi: [],
      todo: true,
      devices: [],
      field: null,
      dialog: false,
      valid: false,
      tabActivo: "sistema",
      drawer: false,
    };
  },
methods: {
    ...mapMutations({
      sendText: "appbar/setFilter",
      setTab: "appbar/setTab",
      setDrawer: "appbar/setDrawer"
    }),
    routerdialog() {
      this.$router.push({ path: "/" });
    },
    routerlister(id) {
      this.$router.push({
        path: "/listerpage",
      });
    },
    search() {
      this.sendText({
        text: this.field,
      });
    },
    tabsDrawer(){
      this.drawer = !this.drawer
      this.setDrawer({
        drawerCondition: this.drawer
      })
    }
  },
  computed: {
    deviceId() {
      return this.$route.query.id;
    },
    render(){
      if(this.$store.state.appbar.currentPage == 'lister'){
        return true
      }
      else if (this.$store.state.appbar.currentPage == 'lister'){
        return falso
      }
    }
  },
  watch: {
    tabActivo:function(){
      this.setTab({
        tab: this.tabActivo,
      });
    }
  }
  
};
</script>
<style scoped>
.boton {
  position: absolute;
  top: 0px;
  right: 0px;
}
.lista1 {
  float: left;
  width: 100%;
}
.lista2 {
  float: right;
}
.menu,
.mobile {
  display: none;
}

@media only screen and (max-width: 768px) {
  .nav_item,
  .tittle {
    display: none;
  }

  .menu,
  .mobile {
    display: block;
  }
}
</style>