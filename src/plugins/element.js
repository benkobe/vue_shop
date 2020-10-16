import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示组件
// import { message } from 'element-ui'

//合并按需导入
import {
    Button,
    Form,
    FormItem,
    Input,
    message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload


} from 'element-ui'

// 导入Timeline和TimelineItem插件
// import Timeline from './timeline/index.js'
// import TimelineItem from './timeline-item/index.js'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
    // Vue.use(Timeline)
    // Vue.use(TimelineItem)

//$message是可以任意命名的，等号右边的message就和导入组件时的名字一样
//将Message组件挂载到Vue实例的原型上，$message就变成了原型上的一个自定义属性了，这样每个组件就能通过this.$message的方式使用message弹框组件
Vue.prototype.$message = message

//$confirm是可以任意命名的
//将MessageBox组件挂载到Vue实例的原型上，$confirm就变成了原型上的一个自定义属性了，这样每个组件就能通过this.$confirm的方式使用MessageBox确认消息弹框组件
Vue.prototype.$confirm = MessageBox.confirm