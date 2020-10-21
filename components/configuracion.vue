<template>
  <div>
    <v-app>
      <v-autocomplete
          style="color: red"
          :items="items"
          label="Oeration to make:"
          required
          v-model="model"
        ></v-autocomplete>
        <codemirror
         :options="cmOptions"
          v-model="code"
          
        />
        <v-btn @click="send" class="send">
          Send
        </v-btn>
        <v-btn @click="reset" class="reset">
          Reset
        </v-btn>
      
    </v-app>
  </div>
</template>
<script>
import "codemirror/mode/javascript/javascript.js";
import { codemirror } from 'vue-codemirror-lite';
import "codemirror/theme/base16-dark.css";
export default {
  components: {
    codemirror,
  },

  name: "configuracion",
  data() {
    return {
      code: '',
     cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/javascript',
        lineWrapping: true,
        theme: 'default'
          
        },
    model : null,
    items:[
      "Reset equipment",
      "Reboot equipment",
      "Turn dowm device",
      "Turn on device",
      "Reset sensors",
    
    ]
    }
  },
  methods:{
    send(){
      alert("Operation send with your javascript thank you!");
    },
    reset(){
      this.code="";
    }
  }

 
};
</script>
<style scoped>
.send{
  float:left;
}
.reset{
  float:right;
}
</style>
