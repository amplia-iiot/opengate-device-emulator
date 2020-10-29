<template>
  <div id="app">
    <v-app id="inspire">
      <lister v-if="this.$store.state.appbar.currentPage == 'lister'"/>
      <emulator v-else-if="this.$store.state.appbar.currentPage == 'emulador'"/>
      <Nuxt />
    </v-app>
  </div>
</template>
<script>
import lister from "@/components/app_bar_lister";
import emulator from "@/components/bar-emulator";
export default {
  components: {
    lister, emulator
  },
};
</script>