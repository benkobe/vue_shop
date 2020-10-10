<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 动态绑定侧边栏的宽度，当isCollapse为true(即点击了折叠)时侧边栏的宽度为60px，如果isCollapse为false(即点击了展开)时侧边栏的宽度为200px -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle_button" @click="isToggle">|||</div>
        <!-- unique-opened表示只保持一个子菜单的展开，有两种写法：1、unique-opened 2、:unique-opened="true" -->
        <!-- collapse动态绑定一个isCollapse值，控制侧边栏的折叠与展开 -->
        <!-- 动态绑定collapse-transition，是否开启折叠动画 -->
        <!-- 是否开启vue-router模式，启用该模式会在激活导航时以index作为path进行路由跳转 -->
        <!-- default-active动态绑定一个activePath值，activePath是一个地址，该地址对应的二级菜单就会高亮显示 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 给一级菜单动态绑定一个index的值，因为如果给了一个固定的index值，点击其中一个一级菜单就会把所有的一级菜单都会展开 -->
          <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menulist"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              :key="subItem.id"
              v-for="subItem in item.children"
              @click="saveNavState('/'+subItem.path)"
            >
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>>
<script>
export default {
  data() {
    return {
      //左侧菜单列表的数据
      menulist: [],
      // 一级菜单的图标字体
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 是否折叠侧边栏
      isCollapse:false,
      // 被激活的链接地址
      activePath:''
    }
  },
  //周期函数，渲染home组件时调用
  created() {
    this.getMenuList()
    //当Home组件被重新渲染时，将上一次的被激活的链接地址(通过sessionStorage的方式获取到) 赋给当前的activePath,让其高亮显示
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear()
      //利用编程式导航 跳转到登录页面
      this.$router.push('/login')
    },
    //获取所有左侧菜单
    async getMenuList() {
      //发送get请求 请求获取左侧菜单列表的数据
      const { data: res } = await this.$http.get('menus')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将获取到的左侧菜单列表的数据赋给data属性中的menulist，便于在模板中把左侧菜单列表渲染出来
      this.menulist = res.data
    },
    // 点击按钮，切换侧边栏的折叠与展开
    isToggle(){
      this.isCollapse = !this.isCollapse;
    },
    // 点击二级菜单，保存对应链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      // 哪个二级菜单被点击了，该二级菜单对应的链接地址就替换掉前一个链接地址
      this.activePath = activePath
    }
  },
}
</script>>
<style lang="less" scoped>
//element组件的名字就是类名
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 1000;
  color: #fff;
  div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: 0;
  }
}
.toggle_button{
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  color: #fff;
  letter-spacing: .2em;
  background-color: #4a5064;
  cursor: pointer;
}
// 使一级菜单的图标和文字有一定的间距
.iconfont {
  margin-right: 10px;
}
.el-main {
  background-color: #eaedf1;
}
</style>>