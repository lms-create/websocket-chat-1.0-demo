<template>
  <div>
    <div class="table width-100p">
      <div class="tableTop flex-center-item background-table">
        <p>{{ title }}</p>
      </div>
      <el-table
        :data="bodyInfo"
        style="width: 100%"
        border
        default-expand-all
        align="center"
        :header-cell-style="{
          background: '#eef1f6',
          color: '#606266',
          'text-align': 'center',
        }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="指标名称">
          <template slot-scope="scope">
            {{ scope.row.name | noDataFilter }}
          </template>
        </el-table-column>
        <el-table-column label="数值">
          <template slot-scope="scope">
            {{ scope.row.num | noDataFilter }}
          </template>
        </el-table-column>
        <el-table-column label="评价">
          <template slot-scope="scope">
            {{ scope.row.assessment | noDataFilter }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BodyTable',
  props: {
    title: {
      type: String,
      default: ''
    },
    bodyInfo: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>

</style>
