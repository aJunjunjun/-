<template>
    <div class="right">
        <!-- 添加面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格结构 -->
        <el-table :data="rightList" style="width: 100%">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="authName" label="权限" width="180">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="180">
            </el-table-column>
            <el-table-column prop="level" label="层级">
                <!-- 获取到当前表单数据 使用 插槽 slot-scope='scope' -->
                <template slot-scope='scope'>
                    <!-- 使用过滤器 -->
                    <span>{{scope.row.level | levelFormat}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
  getAllRightList
} from '@/api/right_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    this.getRightList()
  },
  methods: {
    //   要是页面没有触发事件要怎么调用函数呢? ,那么就使用钩子函数, 钩在页面上一刷新就调用
    async getRightList () {
      let result = await getAllRightList('list')
      console.log(result.data.data)
      this.rightList = result.data.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
