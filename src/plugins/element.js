import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示组件
// import { message } from 'element-ui'

//合并按需导入
import { Button, Form, FormItem, Input, message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    //$message是可以任意命名的，等号右边的message就和导入组件时的名字一样
    //将message组件挂载到Vue实例的原型上，$message就变成了原型上的一个自定义属性了，这样每个组件就能通过this.$message的方式使用message弹框组件
Vue.prototype.$message = message