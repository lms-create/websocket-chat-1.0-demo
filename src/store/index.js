import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import session from './modules/session'
import websocket from './modules/webSocket'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    session,
    websocket
  },
  getters,
  plugins: [persistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        user: val.user,
        session: val.session
      }
    }
  })]
})

export default store
