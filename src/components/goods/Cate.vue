<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <!-- data属性就是绑定表格的数据源 -->
      <!-- columns属性表示表格各列的属性名 -->
      <!-- show-index属性表示是否显示索引列 -->
      <!-- index-text属性表示指定索引列的名称 -->
      <!-- selection-type属性表示是否为多选型的表格，即是否去掉复选框 -->
      <!-- border属性表示是否给表格添加纵向的边框 -->
      <!-- show-row-hover表示鼠标悬停在表格时，鼠标所在的行是否高亮显示 -->
      <!-- expand-type属性表示表格是否为展开行类型的表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :show-index="true"
        index-text="#"
        :selection-type="false"
        border
        :show-row-hover="false"
        :expand-type="false"
        class="treeTable"
      >
        <!-- 是否有效 列(作用域插槽) -->
        <!-- slot="isOK"对应的是columns中的自定义模板列(作用域插槽) -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 列(作用域插槽) -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 列(作用域插槽) -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%"
        @close="addCateDialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="添加分类" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options表示级联选择器的数据源 -->
            <!-- props表示指定配置对象 -->
            <!-- clearable表示可以删除已选择的选项 -->
            <!-- change-on-select表示可以选择任意一项的选项 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类的对话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input> </el-form-item
        ></el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取商品分类数据的查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类数据
      catelist: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          //将当前列指定为模板列(其实就是作用域插槽)
          type: 'template',
          //当前这一列使用的模板名称(其实就是这一列对应的作用域插槽)
          template: 'isOK',
        },
        {
          label: '排序',
          //将当前列指定为模板列(其实就是作用域插槽)
          type: 'template',
          //当前这一列使用的模板名称(其实就是这一列对应的作用域插槽)
          template: 'order',
        },
        {
          label: '操作',
          //将当前列指定为模板列(其实就是作用域插槽)
          type: 'template',
          //当前这一列使用的模板名称(其实就是这一列对应的作用域插槽)
          template: 'opt',
        },
      ],
      //控制添加分类的对话框的隐藏与显示
      addCateDialogVisible: false,
      //添加分类的表单的数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 将要添加的分类的父级分类的id，默认设置为0
        cat_pid: 0,
        // 将要添加的分类的等级，默认要添加的的是一级分类
        cat_level: 0,
      },
      //添加分类的表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //父级分类的数据列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        // 这三个属性的属性值的数据来源都是options属性中的数据源
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类的id数组，这就是因为为什么在props中value的属性值是cat_id了
      selectedKeys: [],
      //控制修改分类对话框的隐藏与显示
      editCateDialogVisible: false,
      //修改分类的表单数据
      editForm: {
        cat_id: '',
        cat_name: '',
      },
      //修改分类的表单验证规则
      editFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    //在商品分类组件渲染时就开始向服务器端请求获取商品分类数据
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      //console.log(res)
      //把商品分类数据赋给catelist
      this.catelist = res.data.result
      //为每页条数赋值
      this.total = res.data.total
    },
    //监听paegsize的变化的事件
    handleSizeChange(newPageSize) {
      // 将用户选择的pagesize赋值给queryInfo(获取商品分类的请求参数对象)中的pagesize
      this.queryInfo.pagesize = newPageSize
      // 重新获取商品分类数据
      this.getCateList()
    },
    //监听页码值的变化
    handleCurrentChange(newPageNum) {
      // 将用户选择的页码值赋值给queryInfo(获取商品分类的请求参数对象)中的pagenum
      this.queryInfo.pagenum = newPageNum
      // 重新获取商品分类数据
      this.getCateList()
    },
    //点击添加分类按钮，获取父级分类数据列表并展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类(包括一级分类和二级分类)的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据列表失败')
      }
      //把获取到的父级分类(包括一级分类和二级分类)赋给parentCateList
      this.parentCateList = res.data
    },
    //选择项发生变化时触发
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果selectedKeys数组的长度大于0，则说明选择了父级分类，如果selectedKeys数组的长度等于0，则说明没有选择父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id为selectedKeys数组中最后一项的数值
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前将要添加的分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
        //如果selectedKeys数组的长度等于0，则说明没有选择父级分类，需要把addCateForm中的cat_level和cat_pid重置为0
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    //点击确定按钮，添加新的分类
    addCate() {
      //点击确定按钮，进行预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        //通过预验证之后向服务器端请求添加分类的请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList()
        this.$message.success('添加分类成功')
        this.addCateDialogVisible = false
      })
    },
    //监听添加分类对话框的关闭事件，并重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //点击修改分类按钮，显示修改分类对话框
    showEditCateDialog(id) {
      this.getCateNameById(id)
      this.editCateDialogVisible = true
    },
    async getCateNameById(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类id失败')
      }
      this.editForm.cat_name = res.data.cat_name
      this.editForm.cat_id = res.data.cat_id
    },
    //点击修改分类按钮，修改分类
    editCate() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          { cat_name: this.editForm.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败')
        }
        this.$message.success('修改分类成功')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    //删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        this.$message.error('已取消删除')
        return
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getCateList()
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>