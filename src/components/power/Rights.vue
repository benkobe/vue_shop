<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 将权限列表数据的数组绑定到该form表单中 -->
      <!-- border属性是用来给表格添加边框的，stripe是用来给表格添加隔行变色效果的 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- prop属性对应的是权限列表数据的数组中的对象中的键名的值 -->
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      rightsList: [],
    }
  },
  //当开始渲染权限列表组件时调用
  created() {
    // 向服务器端请求权限列表数据
    this.getRightsList()
  },
  methods: {
    // 向服务器端请求权限列表数据
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表数据失败')
      }
      //将从服务器端获取到的权限列表数据赋给data属性中的rightsList
      this.rightsList = res.data
      //console.log(this.rightsList)
    },
  },
}
</script>

<style lang="less" scoped>
</style>