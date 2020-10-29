<template>
<v-app-bar extended color="primary" dark >
    
      
        
          <v-dialog v-model="dialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              
              <v-btn
                class="boton"
                color="red"
                dark
                v-bind="attrs"
                v-on="on"
                depressed
              >
                Log out
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline"> ATTENTION </v-card-title>
              <v-card-text>Are you sure?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">
                  No
                </v-btn>
                <v-btn color="red" text @click="routerdialog"> YES </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        

       <template v-slot:extension>
          <v-text-field
            label="Search device"
            clearable
            v-model="field"
            @keyup.enter.native="search"
          ></v-text-field
          ><v-btn icon @click="search">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
       </template>
       
        
     
      
    
  
    
        
      </v-app-bar>
    
  
  
</template>
<script>
import { mapMutations } from "vuex";
import baremulator from "@/components/bar-emulator";
import textField from "@/mixins/textfield.mixin.js";
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
    };
  },
  methods: {
    ...mapMutations({
      sendText: "appbar/setFilter",
      setTab: "appbar/setTab"
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
