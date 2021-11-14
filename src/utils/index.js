import request from '@/utils/request'

export default {
  /**
     *ajax的封装（post）
     * @param funcUrl  请求的方法地址
     * @param argsData 入参
     * @param successFunc 成功的回调函数
     * @param errorFunc 失败的回调函数
     */
  post: function(funcUrl, argsData, responseType) {
    // let UA = navigator.userAgent
    // let TOKEN = 'xuedao'
    return request({
      url: funcUrl,
      method: 'post',
      data: argsData,
      responseType
    })
  },
  /**
     * trim函数表示去除 字符串前后 的空格
     * u3000 空格  u00A0 不间断空格
     * @param str
     * @returns {XML|void|string}
     */
  trim: function(str) {
    return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, '')
  },
  /**
     * 判断是否为空
     * 先判断是否为undefined，在判断是否为null，最后判断如果是字符串的话，是否是“”
     * 满足以上任何一种则返回true，其余情况返回false
     * @param obj
     * @returns {boolean}
     */
  isEmpty: function(obj) {
    if (obj === undefined) {
      return true
    } else if (obj === null) {
      return true
    } else if (typeof obj === 'string') {
      if (this.trim(obj) === '') {
        return true
      }
    }
    return false
  },
  unixDateFormat: function(dateStr, dateRule) {
    // dateStr=14030588040000
    // dateRule='yyyy-MM-dd h:m:s'
    var newDate = new Date()
    newDate.setTime(dateStr)
    return newDate.format(dateRule)
  }
}
// eslint-disable-next-line no-extend-native
Date.prototype.format = function(format) {
  var date = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S+': this.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}
