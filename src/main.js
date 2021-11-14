import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/styles/common.less' // global css

import App from './App'
import axios from 'axios'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import common from '@/utils'
import sha256 from 'js-sha256'
import tips from '@/assets/json/tips.json5'
import tableData from '@/assets/json/tableData.json5'
import globalData from '@/utils/constant.js'
import '@/utils/filters.js'

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// Vue.prototype.$websocket = websocket;
Vue.prototype.$sha256 = sha256
Vue.prototype.$tips = tips
Vue.prototype.$globalData = globalData
Vue.prototype.$tableData = tableData
window.$common = common

async function initi() {
  axios.defaults.baseURL = Vue.prototype.BASE_API
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

initi()
