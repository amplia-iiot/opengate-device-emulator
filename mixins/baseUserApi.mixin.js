export default {
    computed: {
        apiUsuario() {
            return this.$store.state.ogapi.apiKey
        },
        $api() {
            return this.$store.state.ogapi.api
        }
    }
}