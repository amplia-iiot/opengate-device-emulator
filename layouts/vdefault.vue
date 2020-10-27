<template>
<div>
    <v-app>
<appbar/>
 <Nuxt/>
    </v-app>
 </div>
     
</template>
<script>
import appbar from '@/components/app_bar_lister'
export default {
     components:{
         appbar
},
}
</script>