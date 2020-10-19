//这是项目发布阶段需要用到的babel插件
const prodPlugins = []
    //如果处于产品发布阶段，就清除console
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console')
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        //...表示展开运算符，就是将prodPlugins数组中的每一项都展开
        //发布产品时用到的插件数组
        ...prodPlugins,
        '@babel/plugin-syntax-dynamic-import'
    ]
}