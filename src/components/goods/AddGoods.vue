<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 进度条区域 -->
      <!-- active属性表示进度条中的第几个处于被激活的状态，由于data中的activeIndex的数据类型为字符串，而active属性只接收数字型的值，所以加一个 '-0' -->
      <!-- align-center属性表示进度条居中显示 -->
      <el-steps
        :space="300"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 纵向Tab栏区域 -->
      <!-- el-form表单标签需要包裹着el-tabs标签 -->
      <!-- v-model绑定的值是选中选项卡的 name(即选中哪个el-tab-pane标签，el-tabs中的v-model的值就改为这个el-tab-pane标签中的name属性的值，同时data中的activeIndex的值也会修改这个值)，并与data中的activeIndex进行双向绑定 -->
      <!-- name中的值是字符串的，所以把data中的activeIndex的数据类型改为字符串类型的 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <!-- before-leave属性绑定的是一个函数，这个函数会在切换tab页时触发 -->
        <!-- tab-click事件会在其中任意一个tab被选中时触发 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- prop属性表示启用addFormRules中的哪个验证规则 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- beforeTabsLeave属性绑定的数据类型是一个带参数的函数，但是绑定的时候不需要传递参数过去 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProp"
                @change="handleCateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in manyTableData"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item1"
                  :key="index"
                  v-for="(item1, index) in item.attr_vals"
                  border
                ></el-checkbox
              ></el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in onlyTableData"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片上传到的后台API地址 -->
            <!-- on-preview绑定的是一个函数，会在用户点击预览时触发 -->
            <!-- on-remove绑定的是一个函数，会在用户点击关闭图片时触发 -->
            <!-- 因为Upload组件没有通过axios的方式发送Ajax请求，所以请求头就没有携带token，会导致图片上传不成功，现在需要手动设置请求头headers(给请求头添加一个token) -->
            <!-- on-suucess属性绑定的是一个函数，会在图片上传成功之后触发 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 副文本编辑器区域 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewImgDialogVisible"
      width="50%"
    >
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入 lodash (使用其cloneDeep方法来对对象进行深拷贝)
import _ from 'lodash'
export default {
  data() {
    return {
      //进度条中的被激活的索引号
      activeIndex: '0',
      //添加表单的数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //保存商品分类id的数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情介绍
        goods_introduce: '',
        //动态参数和静态属性的数组
        attrs: [],
      },
      //添加表单的验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 商品分类数据
      catelist: [],
      //级联选择框的配置对象
      cateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //商品动态参数数据
      manyTableData: [],
      //商品静态属性数据
      onlyTableData: [],
      //上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件Upload的请求头headers对象
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //预览图片的完整路径
      previewPath: '',
      //控制预览图片的隐藏与显示
      previewImgDialogVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message('获取商品分类数据失败')
      }
      this.catelist = res.data
      // console.log(res)
    },
    //当级联选择框中的选中项发生变化时触发
    handleCateChange() {
      // console.log(this.addForm.goods_cat)
      // if (this.addForm.goods_cat.lenght !== 3) {
      //   this.addForm.goods_cat = []
      // }
    },
    //当切换Tabs标签页时会触发
    //oldActiveName表示当前tab-pane对应的name值
    //activeName表示将要切换到的tab-pane对应的name值
    beforeTabsLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        //return false表示禁止切换
        return false
      }
    },
    //会在其中任意一个tab被选中时触发
    async tabClicked() {
      //如果切换到商品参数(即name="1"时)这个tab
      if (this.activeIndex === '1') {
        // 获取动态参数列表数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        // console.log(res.data)
        // 循环商品动态参数
        res.data.forEach((item) => {
          // 将商品动态参数中的attr_vals的数据(字符串)以空格为分隔符转换为数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
      if (this.activeIndex === '2') {
        // 获取静态属性列表数据
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败')
        }
        // console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    //会在用户点击图片名称预览时触发
    handlePreview(file) {
      // console.log(file)
      //获取到将要预览的图片的完整路径
      const previewPath = file.response.data.url
      this.previewPath = previewPath
      this.previewImgDialogVisible = true
    },
    //会在用户点击关闭图片时触发
    handleRemove(file) {
      // console.log(file)
      //获取到将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //从pics数组中，根据filePath找到这张要被删除的图片的对应的索引值
      // findIndex方法返回的是符合条件的数组的索引值
      const index = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //调用数组的splice方法，根据index把要被删除的图片的图片信息对象从pics数组中删除
      this.addForm.pics.splice(index, 1)
      // console.log(this.addForm)
    },
    //监听图片上传成功的事件(获取图片上传成功之后服务器端返回的图片临时存放路径)
    handleSuccess(response) {
      // console.log(response)
      //拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      //将图片信息对象推送到pics数组中
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm)
    },
    //点击 添加商品按钮 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入必填的表单项')
        }
        //执行添加商品的业务逻辑
        //cloneDeep(obj)深拷贝this.addFrom对象
        //为什么不直接把addForm中的goods_cat数组转换为字符串呢，因为在cascader中双向绑定了this.addForm.goods_cat，由于cascader只接收数组，所以一旦转换为了字符串之后，cascader就会报错
        //form是addForm深拷贝出来的，这两个对象之间是没有任何关系的
        const form = _.cloneDeep(this.addForm)
        //将form中的goods_cat数组转换为字符串
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach((item) => {
          // atts_value只接收字符串
          const newManyInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          //将newInfo对象push到attrs数组中
          this.addForm.attrs.push(newManyInfo)
        })

        //处理静态属性
        this.onlyTableData.forEach((item) => {
          // atts_value只接收字符串
          const newOnlyInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          //将newInfo对象push到attrs数组中
          this.addForm.attrs.push(newOnlyInfo)
        })
        // 赋值给form对象中的attrs数组中，因为最后请求添加商品的请求参数对象还是form对象
        form.attrs = this.addForm.attrs
        // console.log(form)
        //发起添加商品的请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        //编程式导航，添加商品成功后就跳转到商品列表页面
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    //第三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
// 进度条中的文字大小
.el-step__title {
  font-size: 14px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
.el-cascader {
  width: 300px;
}
</style>