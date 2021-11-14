const state = {
  // categorySearchObj: {
  //   status: this.$tips.DEFAULT_STATUS_ALL,
  //   keywords: ""
  // }
}

var copyState = JSON.stringify(state) // 拷贝state对象
const mutations = {
  SET_PATROL_INFO: (state, query) => {
    state.patrol = query
  },
  SET_SEARCH_OBJ: (state, query) => {
    state[query.key] = query.value
  },
  // SET_TOKEN: (state, query) => {
  //   state.token = query
  // },
  RESET: state => {
    const newCopyState = JSON.parse(copyState)
    for (var i in newCopyState) {
      state[i] = newCopyState[i] // 递归赋值
    }
  }
}

const actions = {}

export default {
  namespaced: true,
  state: state,
  mutations,
  actions
}
