export default {
    computed: {
        apiUsuario() {
            return this.$store.state.ogapi.user
        },
        $api() {
            return this.$store.state.ogapi.api
        },


    }
}