export default {
    computed: {
        userData() {
            return this.$store.state.ogapi.user
        },
        $api() {
            return this.$store.state.ogapi.api
        },


    }
}