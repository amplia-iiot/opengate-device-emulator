export const state = () => ({
    textField :null
  })
  
export const mutations = {
    setFilter(state, {text}) {
        if(state.textField){
            state.textField = null
        }
        state.textField = text
    }
}