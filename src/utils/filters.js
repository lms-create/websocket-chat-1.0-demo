import Vue from 'vue'
import CONSTANT from '@/utils/constant.js'

// 空值过滤器
Vue.filter('noDataFilter', function(value) {
  if (value === '' || value === null || value === undefined || value.length === 0) {
    return '- -'
  } else {
    return value
  }
})

Vue.filter('unixDateFormat', function(dateStr, dateRule) {
  var newDate = new Date()
  newDate.setTime(dateStr)
  return newDate.format(dateRule)
})

Vue.filter('enumFormat', function(enumValue, enumType) {
  let result = '- -'
  enumType = parseInt(enumType)
  enumValue = parseInt(enumValue)
  for (let i = 0; i < CONSTANT.VALUE_ENUM_MAPPING.length; i++) {
    if (CONSTANT.VALUE_ENUM_MAPPING[i].type === enumType) {
      const temp = CONSTANT.VALUE_ENUM_MAPPING[i].data
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].key === enumValue) {
          result = temp[j].value
          break
        }
      }
      break
    }
  }
  return result
})

// 数字千分位
Vue.filter('numFormat', function(value) {
  if (!value) return '0.00'
  if (typeof value !== 'string') {
    value = value.toString()
  }
  var intPart = value.split('.')[0] // 获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  var floatPart = '.00' // 预定义小数部分
  var value2Array = value.split('.')
  // =2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString() // 拿到小数部分
    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart + '0'
    } else {
      return intPartFormat + '.' + floatPart
    }
  } else {
    return intPartFormat + floatPart
  }
})
