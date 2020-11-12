export const state = () => ({
    textField: null,
    tabActive: null,
    user: null
})

export const mutations = {
    setFilter(state, {
        text
    }) {
        if (state.textField) {
            state.textField = null
        }
        state.textField = text
    },
    setTab(state, {
        tab
    }) {
        state.tabActive = tab
    },
    setUser(state, {
        email
    }) {
        state.user = email
    }
}