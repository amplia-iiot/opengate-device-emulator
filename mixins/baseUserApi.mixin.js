export default {
    computed: {
        apiUsuario() {
            return this.$store.state.ogapi.apiKey
        },
        $api() {
            return this.$store.state.ogapi.api
        },
        textField() {
            return this.$store.state.appbar.textField
       
        },
        tab(){
            return this.$store.state.appbar.tabActive
        },
        getDrawer(){
            return this.$store.state.appbar.drawer
        }

    }
}