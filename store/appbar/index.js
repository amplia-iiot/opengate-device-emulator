export const state = () => ({
    textField :null,
    currentPage :null,
    tabActive: null,
    drawer: null
  })
  
export const mutations = {
    setFilter(state, {text}) {
        if(state.textField){
            state.textField = null
        }
        state.textField = text
    },
    setPage(state, {page}){
         if(state.currentPage){
            state.currentPage= null
        }
    state.currentPage = page
    },
    setTab(state,{tab}){
    state.tabActive = tab
    },
    setDrawer(state,{drawerCondition}){
    state.drawer = drawerCondition
    }
}