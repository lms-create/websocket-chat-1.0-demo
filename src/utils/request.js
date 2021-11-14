import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
import router from '../router'
// const token = ''

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600 * 1000 // request timeout 10分钟
})

// request interceptor
service.interceptors.request.use(
  config => {
    // const token = store.state.user.userInfo.token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.authorization = token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.data.retCode === 401 || response.data.retCode === 5002 || response.data.retCode === 5003) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      sessionStorage.clear()
      // store.commit('user/SET_TOKEN', null)
      router.push(`/login?redirect=%2F`)
    }
    return response
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '请求数据失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
