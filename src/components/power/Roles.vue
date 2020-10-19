<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addUserDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleslist" border stripe>
        <!-- type="expand"表示展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- el-row栅格系统 -->
            <!-- 循环一级权限 -->
            <!-- 每一行都有bdbottom这个类，并且只有第一行(即index1===0时)有bdtop这个类 -->
            <!-- verticalCenter这个类的作用是使el-tag纵向居中对齐 -->
            <el-row :key="item1.id" v-for="(item1, index1) in scope.row.children" :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'verticalCenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <!-- 三角形字体图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套 渲染二级权限 -->
                <!-- item1表示一级权限，所以item1.children就是二级权限 -->
                <!-- verticalCenter这个类的作用是使el-tag纵向居中对齐 -->
                <el-row :key="item2.id" v-for="(item2, index2) in item1.children" :class="[index2 === 0 ? '' : 'bdtop', 'verticalCenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过for循环嵌套 渲染三级权限 -->
                    <!-- closable属性表示添加了一个可删除的选项 -->
                    <!-- close关闭事件会在点击叉号时触发 -->
                    <el-tag type="warning" closable :key="item3.id" v-for="item3 in item2.children" @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- type="index"表示索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <!-- 动态绑定data属性，表示该树形控件绑定的数据源 -->
      <!-- 动态绑定props属性，表示该树形控件的属性绑定 -->
      <!-- show-checkbox属性表示前面添加一个复选框 -->
      <!-- default-expand-all属性表示展开所有节点 -->
      <!-- node-key是每个树节点用来作为唯一标识的属性，属性值id是指权限数据中的id字段 -->
      <!-- default-checked-keys表示勾选默认选中的节点，此时必须有node-key属性 -->
      <el-tree :data="rightslist" :props="treeProps" node-key="id" show-checkbox default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有的角色列表的数据
      roleslist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有的权限数据
      rightslist: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 角色已选中的节点的id的数组
      defKeys: [],
      // 即将被分配权限的角色的id
      roleId: '',
      //控制添加用户对话框的隐藏与显示
      addUserDialogVisible: false,
      //添加用户的表单
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加表单的验证规则对象
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      //添加表单的验证规则对象
      editFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      //控制编辑用户对话框的隐藏与显示
      editDialogVisible: false,
      editForm: {},
    }
  },
  //当角色列表组件开始被渲染时调用
  created() {
    //向服务器端请求角色列表数据
    this.getRolesList()
  },
  methods: {
    //向服务器端请求角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleslist = res.data
      // console.log(this.roleslist)
    },
    async removeRightById(role, rightId) {
      //弹框提示用户是否确认删除
      //用户如果点击了取消按钮，confirmResult的值为cancle;用户如果点击了确定按钮，confirmResult的值为confirm
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // 如果直接重新向服务器端请求获取角色列表数据的话，会把展开列合上，这样用户体验不好
      // this.getRolesList()
      // 想要删除权限之后不合上展开列，只需要把最新的返回数据(返回的数据是最新的权限数据)赋给角色的权限(即角色的children)即可
      role.children = res.data
    },
    // 点击分配权限按钮展示分配权限的对话框
    async showSetRightDialog(role) {
      // 将当前角色的id赋给data中的roleId,因为后面需要用到roleId
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      //把获取到的权限数据保存到data中
      this.rightslist = res.data
      // 调用getLeafKeys函数获取到当前角色的所有三级权限的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      // console.log(this.rightslist)
    },
    // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前节点没有children属性，则是三级权限，将其id保存到数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果当前节点有children属性，则循环该节点的children属性里面的节点，然后调用当前函数
      // item是指循环当前项，即当前节点的children属性里面的某一个节点
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 每次关闭分配权限的对话框时，都要清空defKeys数组中的数据，如果不清空，当点击不同角色的分配权限按钮时，defKeys数组中的id值会累积得越来越多，导致数据不准确
      this.defKeys = []
    },
    // 点击确定按钮分配权限
    async allotRight() {
      // ...是展开运算符，因为getCheckedKeys和getHalfCheckedKeys方法返回的都是一个数组，这样写就可以把两个方法返回的两个数组合并为一个数组
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.getRolesList()
      this.$message.success('分配权限成功')
      this.setRightDialogVisible = false
    },
    //点击确定按钮，添加用户
    async addUser() {
      if (this.addForm.roleName === '' || this.addForm.roleDesc === '') {
        this.$message.error('请输入角色名称或者角色描述')
        return
      }
      const { data: res } = await this.$http.post('roles', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加用户失败')
      }
      this.getRolesList()
      this.$message.success('添加用户成功')
      this.addUserDialogVisible = false
    },
    // 监听添加用户对话框的关闭事件，当关闭添加用户对话框时，重置表单
    addDialogClosed() {
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
      // 重置表单(需要拿到整个表单的引用)
      this.$refs.addFormRef.resetFields()
    },
    //点击修改按钮，显示修改用户的对话框,并将角色的数据显示在对话框中
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return
      }
      this.editForm = res.data
    },
    //点击编辑按钮，编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, 
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑用户失败')
        }
        this.getRolesList()
        this.$message.success('编辑用户成功')
        this.editDialogVisible = false
      })
    },
    //监听添加用户对话框的关闭事件，当关闭添加用户对话框时，重置表单
    editDialogClosed() {
      // 重置表单(需要拿到整个表单的引用)
      this.$refs.editFormRef.resetFields()
    },
    //点击删除按钮，删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户失败')
      }
      this.getRolesList()
      this.$message.success('删除用户成功')
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 纵向居中对齐
.verticalCenter {
  display: flex;
  align-items: center;
}
</style>