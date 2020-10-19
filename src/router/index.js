import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Login.vue');
// import Home from '../components/Home.vue'
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue');
// import Welcome from '../components/Welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue');


// import Users from '../components/user/Users.vue'
const Users = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue');
// import Rights from '../components/power/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue');
// import Roles from '../components/power/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue');

// import Cate from '../components/goods/Cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue');
// import Params from '../components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName: "cate_params" */ '../components/goods/Params.vue');

// import GoodsList from '../components/goods/List.vue'
const GoodsList = () =>
    import ( /* webpackChunkName: "goodslist_addgoods" */ '../components/goods/List.vue');
// import AddGoods from '../components/goods/AddGoods.vue'
const AddGoods = () =>
    import ( /* webpackChunkName: "goodslist_addgoods" */ '../components/goods/AddGoods.vue');

// import Order from '../components/order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName: "order_report" */ '../components/order/Order.vue');
// import Report from '../components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "order_report" */ '../components/report/Report.vue');

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        // Welcome组件作为Home组件的子组件，所以Welcome的路由也是Home的子路由
        // Users组件作为Home组件的子组件，所以Users的路由也是Home的子路由
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/goods', component: GoodsList },
                { path: '/goods/addgoods', component: AddGoods },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
        }
    ]
});

//为路由对象添加beforeEach导航守卫
//导航守卫beforeEach接收一个回调函数，回调函数有三个形参，形参to表示将要访问的页面，from表示从哪个页面跳转而来, next表示放行函数
router.beforeEach((to, from, next) => {
    //如果用户将要访问的是登录页面，直接放行
    if (to.path === '/login') return next();
    //如果用户不是从登录页面来的，那么就尝试从sessionStorage中获取保存的token值
    const tokenStr = window.sessionStorage.getItem('token');
    //如果没有token(即token是一个空字符串)，就强制跳转到登录页面
    if (!tokenStr) return next('/login');
    //如果有token就让用户继续访问用户输入的网址
    next();
})

export default router