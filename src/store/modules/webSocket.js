// const state = {
//   socket: null
// }
const state = {
  socketTask: null, // ws链接
  webSocketPingTimer: null, // 心跳定时器
  webSocketPingTime: 10000, // 心跳的间隔，当前为 10秒,
  webSocketReconnectCount: 0, // 重连次数
  webSocketIsReconnect: true, // 是否重连
  webSocketIsOpen: true,
  u_account: null, // ws登录userId
  sid: null, // ws登录token
  msg: null, // 接收到的信息
  userList: []
}
const mutations = {
  // 发送http请求登录后设置用户id 用于ws登录
  setUac(state, u_account) {
    state.u_account = u_account
  },
  // 发送http请求登录后设置用户token 用于ws登录
  setSid(state, sid) {
    state.sid = sid
  },
  setClose(state) {
    state.webSocketIsReconnect = false
    console.log('手动关闭')
    const data = {
      type: -1,
      user_account: sessionStorage.getItem('user_account')
    }
    this.commit('websocket/webSocketSend', data)
    state.socketTask.close()
    // this.commit('websocket/webSocketClose')
  },
  // 初始化ws 用户登录后调用
  webSocketInit(state) {
    const that = this
    state.socketTask = new WebSocket('ws://localhost:3000')
    // ws连接开启后登录验证
    state.socketTask.onopen = function() {
      console.log('WebSocket连接正常打开中...！')
      state.webSocketIsReconnect = true
      state.webSocketReconnectCount = 0
      that.commit('websocket/webSocketLogin')
      // 开始心跳
      that.commit('websocket/webSocketPing')
      // 注：只有连接正常打开中 ，才能正常收到消息
      state.socketTask.onmessage = function(res) {
        // console.log('收到服务器内容：', JSON.parse(res.data))
        state.msg = JSON.parse(res.data)
        const data = JSON.parse(res.data)
        if (data.code === 1) {
          const chatRecord = JSON.parse(sessionStorage.getItem(data.toYouUser)) || []
          chatRecord.push({
            flag: 2,
            message: data.data
          })
          sessionStorage.setItem(data.toYouUser, JSON.stringify(chatRecord))
        } else if (data.code === 2) {
          state.userList = data.result
        }
      }
    }
    state.socketTask.onerror = function(errMsg) {
      console.log(errMsg)
      console.log('ws连接异常')
      that.commit('websocket/webSocketClose')
    }
    state.socketTask.onclose = function(errMsg) {
      console.log(errMsg)
      console.log('ws连接关闭')
      that.commit('websocket/webSocketClose')
    }
  },
  webSocketLogin() {
    const that = this
    console.log('ws登录')
    const payload = {
      type: 0,
      user_account: sessionStorage.getItem('user_account'),
      user_name: sessionStorage.getItem('user_name')
    }
    that.commit('websocket/webSocketSend', payload)
    state.webSocketIsOpen = true
  },

  // 断开连接时
  webSocketClose(state) {
    const that = this
    // 修改状态为未连接
    state.webSocketIsOpen = false
    state.webSocket = null
    // 判断是否重连
    if (
      state.webSocketIsReconnect &&
      state.webSocketReconnectCount === 0
    ) {
      // 第一次直接尝试重连
      that.commit('websocket/webSocketReconnect')
    }
  },

  // 定时心跳
  webSocketPing() {
    const that = this
    state.webSocketPingTimer = setTimeout(() => {
      if (!state.webSocketIsOpen) {
        return false
      }
      // console.log('心跳')
      // const payload = {
      //   type: -1
      // }
      // that.commit('websocket/webSocketSend', payload)

      clearTimeout(state.webSocketPingTimer)
      // 重新执行
      that.commit('websocket/webSocketPing')
    }, state.webSocketPingTime)
  },

  // WebSocket 重连
  webSocketReconnect(state) {
    const that = this
    if (state.webSocketIsOpen) {
      return false
    }
    console.log('第' + state.webSocketReconnectCount + '次重连')
    state.webSocketReconnectCount += 1
    // 判断是否到了最大重连次数
    if (state.webSocketReconnectCount >= 10) {
      this.webSocketWarningText = '重连次数超限'
      return false
    }
    // 初始化
    console.log('开始重连')
    that.commit('websocket/webSocketInit')

    // 每过 5 秒尝试一次，检查是否连接成功，直到超过最大重连次数
    const timer = setTimeout(() => {
      that.commit('websocket/webSocketReconnect')
      clearTimeout(timer)
    }, 5000)
  },

  // 发送ws消息
  webSocketSend(state, payload) {
    state.socketTask.send(
      JSON.stringify(payload),
    )
  }
}
const actions = {
  webSocketInit({ commit }, url) {
    commit('websocket/webSocketInit', url)
  },
  webSocketSend({ commit }, p) {
    commit('websocket/webSocketSend', p)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
