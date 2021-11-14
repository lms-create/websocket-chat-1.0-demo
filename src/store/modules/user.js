// import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import initwebSocket from '@/utils/webSocket'
const state = {
  userInfo: null
}

const mutations = {
  // SET_TOKEN: (state, token) => {
  //     state.token = token
  // },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      window.$common.post('/api/login', {
        username: account,
        password
      }).then(res => {
        console.log(res)
        if (res.data.retCode === 1) {
          localStorage.setItem('token', res.data.result.token)
          commit('SET_USER_INFO', res.data.result)
          sessionStorage.setItem('user_account', res.data.result.user_account)
          sessionStorage.setItem('user_name', res.data.result.user_name)
          resolve(res.data.result)
          // this.$message.success(res.data.message)
        } else {
          reject(res.data.message)
          // this.$message.error(res.data.message)
        }
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // commit('SET_TOKEN', '')
      // removeToken()
      localStorage.clear()
      sessionStorage.clear()
      commit('SET_USER_INFO', null)
      resetRouter()
      resolve(null)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // commit('SET_TOKEN', '')
      // removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
