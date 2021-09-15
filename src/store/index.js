import { createStore } from 'vuex'

export default createStore({
  state: {
    conf: {},
    confReady: 0
  },
  mutations: {
    setConf(st, val) {
      st.conf = val
    },
    setConfReady(st, val) {
      st.confReady = val
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
