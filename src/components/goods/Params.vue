<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- v-model 是把在级联选择框中选中的商品分类的id双向绑定到selectedCateKeys数组中 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleCascaderChange"
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <!-- v-model双向绑定的值对应el-tab-pane标签中的name属性的值，activeName的值是哪个name的值就显示这个name属性所在的el-tab-pane标签的内容 -->
      <!-- tab-click事件会在点击tab页切换时触发 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数的表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  closable
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  @close="daleteTag(index, scope.row)"
                  >{{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- prop属性绑定的值是el-table标签中data属性绑定的值(对象)中的attr_name,即prop属性绑定的值是这一列的数据来源 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态属性的表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  closable
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  @close="daleteTag(index, scope.row)"
                  >{{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 动态参数/静态属性 的对话框 -->
    <el-dialog
      :title="'添加' + this.dialogText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 动态参数/静态属性 的对话框 -->
    <el-dialog
      :title="'添加' + this.dialogText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      catelist: [],
      //级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 级联选择框双向绑定选择的商品分类的id的数组
      selectedCateKeys: [],
      //被点击的tab页签的name属性的值
      activeName: 'many',
      //动态参数的数据
      manyTabData: [],
      //静态属性的数据
      onlyTabData: [],
      //控制添加 动态参数/静态参数 对话框的隐藏与显示
      addDialogVisible: false,
      //添加 动态参数/静态参数 的表单数据对象
      addForm: {},
      //添加 动态参数/静态参数 的表单验证对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
        ],
      },
      //控制编辑对话框的隐藏与显示
      editDialogVisible: false,
      //编辑表单的数据对象
      editForm: {},
      //编辑表单的验证规则的数据对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类参数
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    // 当级联选择框中的选项发生变化时触发
    handleCascaderChange() {
      this.getParamsData()
    },
    // tab-click事件会在点击tab页切换时触发
    handleTabClick() {
      this.getParamsData()
    },
    //获取参数(动态参数和静态属性)列表数据
    async getParamsData() {
      //证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // console.log(this.selectedCateKeys)
      // 如果选中的是三级分类，就开始向服务器端请求动态参数数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取动态参数失败')
      }
      //循环服务器端返回的参数列表
      res.data.forEach((item) => {
        // split()方法返回的是一个数组
        // item.attr_vals原来的数据类型是字符串，然后将其转换为数组(以空格为分隔符)
        //如果item.attr_vals数组不为空就将字符串转换为数组；如果为空，就将这个空字符串变为一个空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //用于控制文本框的隐藏与显示
        item.inputVisible = false
        //文本框的值
        item.inputValue = ''
      })

      // console.log(res.data)
      //将获取到的数据进行判断
      // 如果当前处于动态参数的Tab页签中，那么获取到的数据是动态参数数据，应该保存到manyTabData中
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        // 如果当前处于静态属性的Tab页签中，那么获取到的数据是静态属性数据，应该保存到onlyTabData中
        this.onlyTabData = res.data
      }
    },
    //监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮，添加 动态参数/静态属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.getParamsData()
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
      })
    },
    //点击编辑按钮 显示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('查询参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听编辑对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击确定按钮，提交编辑表单
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑参数失败')
        }
        this.getParamsData()
        this.$message.success('编辑参数成功')
        this.editDialogVisible = false
      })
    },
    //点击删除按钮，根据id删除参数
    async deleteParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.getParamsData()
      this.$message.success('删除参数成功')
    },
    //点击添加的按钮，显示文本输入框
    showInput(row) {
      row.inputVisible = true
      //$nextTick 方法的作用：就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick((_) => {
        //让文本框自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //当失去焦点或者按下 enter 键之后触发
    async handleInputConfirm(row) {
      //当失去焦点或者按下 enter 键之后，如果输入的内容不合法(即输入空格)，就将输入的内容重置为空，并隐藏输入框显示添加按钮
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      //如果没有return，证明输入的内容合法，需要做后续的处理(就是将输入的合法内容推送到attr_vals数组中)
      //当输入的内容被推送到attr_vals数组中时，el-tag标签中的v-for应该是实时更新渲染的，所以输入的文本能够立即渲染为tag按钮 (我个人的理解，不一定正确)
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求，保存此次操作到数据库中
      this.saveAttrVals(row)
    },
    //将对attr_vals的操作，保存到数据库中
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑参数项失败')
      }
      //为什么不需要手动调用getParamsData方法呢？因为在此之前tag按钮已经被实时渲染出来了，没必要在调用getParamsData方法再渲染多一次页面，只需要请求 把编辑的数据 保存在数据库中就行了
      this.$message.success('编辑参数项成功')
    },
    //删除tag参数
    daleteTag(index, row) {
      row.attr_vals.splice(index, 1)
      // 发起请求，保存此次操作到数据库中
      this.saveAttrVals(row)
    },
  },
  //计算属性
  computed: {
    // 按钮是否被禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    //获取级联选择框中选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //动态计算 添加/编辑参数对话框 中的部分文本
    dialogText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
// 添加文本时，文本的宽度
.input-new-tag {
  width: 120px;
}
</style>