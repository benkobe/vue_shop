<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加用户区域 -->
      <!-- 动态绑定gutter属性，表示row中各个col之间的间距 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框中的文字与请求参数对象中的query请求参数双向绑定 -->
          <!-- 使用clearable属性即可得到一个可清空的输入框 -->
          <!-- clear类型事件会在点击由 clearable 属性生成的清空按钮时触发 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <!-- 点击搜索按钮，重新向服务器端发送请求 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <!-- 动态绑定data属性，userlist值表示用户列表数据 -->
      <el-table :data="userlist" border stripe>
        <!-- 为用户列表添加索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- prop属性表示用户数据列表中的具体某一项数据 -->
        <!-- label表示数据属于哪一列 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- scope.row可以拿到当前行的数据 -->
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <!-- size是表示按钮的大小，mini是最小的了 -->
            <!-- scope.row可以拿到这行用户的所有数据，在showEditDialog方法中通过scope.row.id把当前需要修改的用户的id传递过去，然后根据id查询得到该用户的所有信息，然后再渲染到修改用户的对话框中 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <!-- 点击删除按钮，删除用户，并传递当前要删除的用户的id -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- tooltip是提示文字 -->
            <!-- 动态绑定enterable属性，表示鼠标是否可以进入到tooltip里面 -->
            <!-- content属性表示提示信息 -->
            <el-tooltip
              effect="dark"
              placement="top"
              content="分配角色"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区域 -->
      <!-- handleSizeChange事件会在 修改每页显示多少条数据 时触发 -->
      <!-- handleCurrentChange事件会在 切换页数 时触发 -->
      <!-- 动态绑定current-page，值为queryInfo.pagenum，表示当前的所在的页数 -->
      <!-- 动态绑定page-size属性，值为queryInfo.pagesize，表示当前每页显示多少条数据 -->
      <!-- layout属性表示显示哪些功能模块 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户弹出的对话框 -->
    <!-- 动态绑定visible.sync属性，表示控制 添加用户弹出的对话框 的隐藏与显示，默认是false(隐藏)-->
    <!-- close事件会在添加用户表单对话框被关闭时触发 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 动态绑定model属性，属性值为 添加用户的表单数据对象(指定表单) -->
      <!-- 动态绑定rules属性，属性值为 添加用户的表单的验证规则对象(指定表单验证规则) -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- prop属性的值为 验证规则对象中的属性 -->
        <el-form-item label="用户名" prop="username">
          <!-- 输入框中 双向绑定 添加用户的表单数据对象中的username属性 -->
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <!-- 输入框中 双向绑定 添加用户的表单数据对象中的password属性 -->
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <!-- 输入框中 双向绑定 添加用户的表单数据对象中的email属性 -->
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <!-- 输入框中 双向绑定 添加用户的表单数据对象中的mobile属性 -->
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 当点击取消按钮按钮时，隐藏添加用户的对话框 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <!-- :model表示el-form标签绑定的是editForm表单数据对象 -->
      <!-- :rules表示el-form标签绑定的是editFormRules验证规则对象 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- prop属性表示使用editFormRules验证规则对象中的email规则 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- prop属性表示使用editFormRules验证规则对象中的mobile规则 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户: {{ this.userInfo.username }}</p>
        <p>当前角色: {{ this.userInfo.role_name }}</p>
        <p>
          分配新角色:
          <!-- v-model双向绑定，选择好哪个选项之后，绑定的数据展示在select框中 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <!-- 动态绑定的label属性会展示在下拉选项中 -->
            <!-- 动态绑定的value属性是展示在select框中的真正数据 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义验证邮箱的规则
    // 形参value表示需要被验证的邮箱(即用户输入的邮箱)
    var checkEmail = (rules, value, callback) => {
      //自定义验证邮箱规则的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 如果输入的邮箱通过了自定义验证规则，则返回callback回调函数
        return callback()
      }
      // 如果输入的邮箱没有通过自定义验证规则，调用callback回调函数并在里面新建错误信息
      callback(new Error('请输入正确的邮箱'))
    }
    // 自定义验证手机号的规则
    // 形参value表示需要被验证的手机号(即用户输入的手机号)
    var checkMoblie = (rules, value, callback) => {
      //自定义验证手机号规则的正则表达式
      const regEmail = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regEmail.test(value)) {
        // 如果输入的手机号通过了自定义验证规则，则返回callback回调函数
        return callback()
      }
      // 如果输入的手机号没有通过自定义验证规则，调用callback回调函数并在里面新建错误信息
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 请求获取用户列表的请求参数对象
      queryInfo: {
        query: '',
        // 当前的所在的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //控制 添加用户弹出的对话框 的隐藏与显示
      addDialogVisible: false,
      //添加用户的表单数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //添加用户的表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '用户名应该在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 16,
            message: '密码应该在6~16个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          // 调用自定义验证规则(validator)
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur',
          },
          // 调用自定义验证规则(validator)
          {
            validator: checkMoblie,
            trigger: 'blur',
          },
        ],
      },
      // 控制修改用户对话框的隐藏与显示
      editDialogVisible: false,
      //将要显示在修改用户对话框中的表单的数据对象
      editForm: {},
      //修改用户的表单的验证规则对象
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          // 调用自定义验证规则(validator)
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur',
          },
          // 调用自定义验证规则(validator)
          {
            validator: checkMoblie,
            trigger: 'blur',
          },
        ],
      },
      //控制分配角色的对话框的隐藏与显示
      setRoleDialogVisible: false,
      // 需要被分配角色的用户的信息
      userInfo: {},
      // 所有角色的数据
      roleList: [],
      //已选中的角色的id值
      selectedRoleId: '',
    }
  },
  created() {
    //当开始渲染Users组件时，马上调用getUserList()（其实就是马上向服务器端发送请求用户列表数据的请求）
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发送请求获取用户列表数据
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo,
      })
      //如果服务器端返回的状态码不是200，返回错误信息
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      //如果服务器端返回的状态码是200，将用户列表数据赋给data属性中的userlist和total
      this.userlist = res.data.users
      this.total = res.data.total
      //   console.log(res)
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      // 当点击修改每页显示多少条数据时，将点击的那个数值赋给请求参数对象中的pagesize，然后调用获取用户列表数据的函数，重新请求数据来渲染页面
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页数 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      // 当点击其他页码(非当前页码)时，将点击的那个页码赋给请求参数对象中的pagenum，然后调用获取用户列表数据的函数，重新请求数据来渲染页面
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关的状态变化的事件
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      //当需要拼接动态请求参数时，最好把单引号修改为反引号
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        //如果返回的状态码不是200，表示在数据库中并没有修改用户的状态，但是在页面中却是修改了switch开关的状态，所以需要把页面中的switch开关状态取反
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户表单对话框的关闭事件
    addDialogClosed() {
      // 重置表单(需要拿到整个表单的引用)
      this.$refs.addFormRef.resetFields()
    },
    //点击确定按钮，添加新用户
    addUser() {
      // 拿到整个表单的引用，然后进行预检验
      this.$refs.addFormRef.validate(async (valid) => {
        // 如果预检验没有通过，return 将不执行后面的代码
        if (!valid) return
        // 如果预检验通过了，就发送添加用户的网络请求了
        const { data: res } = await this.$http.post('users', this.addForm)
        // 如果服务器端返回的状态码不是201，即表示添加新用户的请求失败，提示错误的信息
        if (res.meta.status !== 201) {
          return this.$message.error('添加新用户失败')
        }
        // 如果服务器端返回的状态码为201，即表示添加新用户的请求成功，提示成功的信息
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    //点击修改按钮，显示修改用户的对话框
    async showEditDialog(id) {
      //根据传递过来的id查询该id用户的所有信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户表单对话框的关闭事件
    editFormClosed() {
      // 重置表单(需要拿到整个表单的引用)
      this.$refs.editFormRef.resetFields()
    },
    //点击确定按钮，修改用户
    editUserInfo() {
      // 拿到整个表单的引用，然后进行预检验
      this.$refs.editFormRef.validate(async (valid) => {
        // 如果预检验没有通过，return 将不执行后面的代码
        if (!valid) return
        //如果预检验通过了，就发送修改用户信息的数据请求了
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //重新请求获取用户列表数据
        this.getUserList()
        //提示修改用户成功的信息
        this.$message.success('修改用户成功')
      })
    },
    async removeUserById(id) {
      // 调用this.$confirm()方法就是弹出 确认消息 的弹出框，该方法的返回一个Promise对象
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //如果用户确认删除，返回值为字符串 confirm
      //如果用户取消删除，返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前先获取所有的角色数据
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击确定按钮，分配新角色
    async saveRoleInfo() {
      //如果没有选择新角色
      if (!this.selectedRoleId) {
        return this.$message.error('请选择新角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}}/role`,
        {
          rid: this.selectedRoleId,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配新角色失败')
      }
      this.$message.success('分配新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    //监听分配新角色对话框的关闭事件
    setRoleDialogClosed() {
      // 将用户上一次选择清空
      this.selectedRoleId = ''
    },
  },
}
</script>>
<style lang="less" scoped>
.el-pagination{
  margin-top: 10px;
}
</style>