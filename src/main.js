import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
//导入树形插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入副文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入副文本编辑器对应的样式文件
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


import axios from 'axios'
//配置请求根路径(后台服务器的根路径)
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

//全局注册vue-table-with-tree-grid树形插件（注册为全局可用的组件）
Vue.component('tree-table', TreeTable)

//将副文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

//全局注册一个格式化时间的过滤器dateFormat，全局注册，所有组件都可以使用
Vue.filter('dateFormat', function(originVal) {
    // new一个日期对象
    const dt = new Date(originVal)
    const y = dt.getFullYear()
        // +''表示将dt.getMonth()的返回值变为字符串类型数据，然后调用字符串方法padStart,padStart(2,0)表示字符串有两位，如果不够两位在前面补一个'0'
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')