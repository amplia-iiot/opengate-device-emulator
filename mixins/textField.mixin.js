export default {
    computed: {
        textField() {
            return this.$store.state.appbar.textField

        },
        tab() {
            return this.$store.state.appbar.tabActive
        },

    }
}