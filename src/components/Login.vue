<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <!-- :model表示属性绑定(绑定一个model属性)，值是一个数据对象 -->
      <!-- :rules表示属性绑定(绑定一个rules属性)，值是一个验证规则对象 -->
      <!-- 想要重置表单，需要给表单添加一个ref引用，ref属性的值(是可以任意命名的)就是表单的引用对象，表单的引用对象下有多个方法-->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <!-- prop属性表示用户名合法性的验证规则 -->
        <el-form-item prop="username">
          <!-- prefix-icon属性表示在输入框内的前面显示字体图标 -->
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <!-- prop属性表示密码合法性的验证规则 -->
        <el-form-item prop="password">
          <!-- prefix-icon属性表示在输入框内的前面显示字体图标 -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate方法返回的回调函数的第一个参数是布尔值
      this.$refs.loginFormRef.validate(async (valid) => {
        //如果输入的用户名和密码都正确的话，输入true，否则输入false
        // console.log(valid);
        if (!valid) return
        //第一个参数是请求地址，第二个参数是请求参数
        // post请求返回的结果是Promise对象，可以通过async-await方式接收结果
        //{data:res}是对象解构赋值，得到的结果是结果对象中的data属性的值，将将其重命名为res对象
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //1、将登录成功之后服务器端返回的token,保存到客户端的sessionStorage中
        //1.1、项目中除了登录之外的其他API接口，必须在登录之后才能访问 (当客户端登录成功之后，服务器端会返回token给客户端，然后客户端只有携带这个token才能够访问其他API接口；即token相当于服务器端发给客户端的一个身份认证信息，只有客户端拥有这个身份认证信息才能去访问除登录之外的API接口)
        //1.2、token只应该在当前网站打开期间生效，所以将token保存在客户端的sessionStorage中，而不是客户端的localStorage中，因为localStorage是持久化的存储机制，即使关闭了当前网站仍然存储着token，在这里将token保存在sessionStorage中比较合适
        window.sessionStorage.setItem('token', res.data.token)
        //2、通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    },
  },
}
</script>


<style lang="less" scoped>
/* style中必须加上scoped属性，scoped属性的作用是使当前style只在当前单文件组件生效，可以有效地避免了不同单文件组件之间的样式冲突；如果style中没有写scoped属性的话，当前style会在全局生效 */
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
// 头像区域
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #eee;
  padding: 10px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>