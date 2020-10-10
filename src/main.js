import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //axios请求拦截，必须在服务器端接收到请求之前拦截，因为需要对请求对象进行一些处理再发送到服务器端
    //形参config表示请求对象
axios.interceptors.request.use(config => {
    //为请求头对象添加token验证的Authorization字段（其实就是为请求头添加一个Authorization属性，该属性的值是token请求携带的token）
    config.headers.Authorization = window.sessionStorage.getItem('token');
    //对请求对象处理完成之后必须return，不然服务器端就无法接收到请求
    return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')