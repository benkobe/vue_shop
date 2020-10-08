<template>
  <div>
    <el-button type="error" @click="logout">退出登录</el-button>
  </div>
</template>>
<script>
export default {
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear()
      //利用编程式导航 跳转到登录页面
      this.$router.push('/login')
    },
  },
}
</script>>
<style lang="less" scoped>
</style>>