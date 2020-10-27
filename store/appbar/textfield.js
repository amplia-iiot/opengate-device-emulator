export const state = () => ({
    textField :null
  })
  
export const mutations = {
    setFilter(state, {text}) {
        state.textField = text
    }
}