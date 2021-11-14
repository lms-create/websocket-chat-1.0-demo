<template>
  <el-cascader
    v-model="region"
    :options="options"
    :props="props"
  />
</template>

<script>
export default {
  props: {
    options: Object
  },
  data() {
    return {
      region: '',
      props: {
        value: 'areaCode',
        label: 'areaName'
      }
    }
  }
}
</script>

<style>

</style>
