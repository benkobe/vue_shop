<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 输入框中双向绑定queryInfo.query，当点击搜索按钮时请求获取对应query参数的商品列表数据；当清空按钮时，再次请求获取商品列表数据 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border="">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="280px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取商品列表数据的请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表数据对象
      goodsList: [],
      //商品数据总数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取商品列表数据
    async getGoodsList() {
      // get请求中，请求参数对象中需要有params属性
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表数据失败')
      }
      //   this.$message.success('获取商品列表数据成功')
      //   console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //监听 每页显示多少条数据 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听 当前页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //根据id删除商品
    async deleteGoodsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    //前往添加商品页面
    goAddGoodsPage() {
      // $router是路由导航对象
      this.$router.push('/goods/addgoods')
    },
  },
}
</script>

<style lang="less" scoped>
</style>