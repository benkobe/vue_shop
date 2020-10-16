<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <!-- <el-button type="success" plain v-if="pay_status === '1'"
            >已付款</el-button
          >
          <el-button type="warning" plain v-else>未付款</el-button> -->
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">{{
            scope.row.create_time | dateFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAddressDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog"
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
      >
      </el-pagination>
    </el-card>
    <!-- 编辑订单修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="editAddressDialogClosed"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="editAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <!-- <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline> -->
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      //获取订单列表数据的请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //订单列表数据
      orderlist: [],
      //订单总条数
      total: 0,
      //控制编辑订单修改地址的对话框的隐藏与显示
      editAddressDialogVisible: false,
      //修改地址的表单对象
      editAddressForm: {
        address1: [],
        address2: '',
      },
      //修改地址的验证表单对象
      editAddressFormRules: {
        address1: [
          { required: true, message: '请输入选择省市区/县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      //省市区/县联动的数据
      cityData: cityData,
      //控制展示物流进度对话框的隐藏与显示
      progressDialogVisible: false,
      //物流数据
      progressInfo: [],
    }
  },
  created() {
    //获取订单列表数据
    this.getOrderList()
  },
  methods: {
    //获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败')
      }
      //   console.log(res)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    //当修改每页显示多少条数据时触发
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    //当修改当前页码值时触发
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    //点击编辑按钮显示编辑订单修改地址的对话框
    showEditAddressDialog() {
      this.editAddressDialogVisible = true
    },
    //监听修改地址对话框的关闭事件(重置表单)
    editAddressDialogClosed() {
      this.$refs.editAddressFormRef.resetFields()
    },
    //当级联选择器选择项发生变化时触发
    handleCascaderChange() {},
    //点击按钮，展示物流进度对话框
    async showProgressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo = res.data
    //   console.log(this.progressInfo)
      this.progressDialogVisible = true
    },
  },
}
</script>
<style lang="less" scoped>
// 引入timeline时间线插件的样式文件
// @import '../../plugins/timeline/timeline.css';
// @import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>