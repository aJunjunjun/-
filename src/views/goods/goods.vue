<template>
    <div class="list">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
        </el-breadcrumb>
         <el-card class="box-card">
        <router-view></router-view>
         </el-card>

    </div>

</template>

<script>
export default {
  data () {
    return {
      query: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
