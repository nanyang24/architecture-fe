const path = require('path')
const entry = require('./entry')
const ExtractTextPlugin = require("extract-text-webpack-plugin")    //将某些东西从bundel.js中拿出来，通常为CSS
const HtmlWebpackPlugin = require('html-webpack-plugin');           // 渲染html

module.exports = {
    context: path.resolve(process.cwd(), "src"),      // 指定webpack编译上下文，默认为node.js启动的目录
    entry: entry,
    output: {
        publicPath: '/dist',
        path: path.resolve(process.cwd(), "dist"),
        filename: "[name].[chunkhash:8].js"         // 给文件名配置上[chunkhash:8]，其中8是指hash长度为8，默认是16。
        // 缓存控制，浏览器会去加载最新的文件。
        // P.S.这样的处理效果已经很好了，但同样有劣处，即浏览器给这种缓存方式的缓存容量太少了，只有12Mb，且不分Host。所以更极致的做法是以文件名为Key，文件内容为value，缓存在localStorage里，命中则从缓存中取，不命中则去服务器取，虽然缓存容量也只有5Mb，但是每个Host是独享这5Mb的。
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],       // 默认后缀名查找顺序
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                loader: "file-loader",
                options: {
                    name: 'assets/[name]_[sha512:hash:base64:7].[ext]'
                },
            },
        ]
    },
    plugins: [
        // 自动生成页面，文件名带上版本号后，每一次文件变化，都需要Html文件里手动修改引用的文件名，这种重复工作很琐碎且容易出错。
        // 使用 HtmlWebpackPlugin 和 ExtractTextPlugin 插件可以解决此问题。
        // 生成带css的页面
        new ExtractTextPlugin("css/[name].[contenthash:9].css"),
        // 生成带JS的页面
        new HtmlWebpackPlugin({
            template: 'base/webpack.template.html',
            inject: true
            // 下面3行也可以用
            // title: 'sale',
            // chunks: ['sale', 'list'],       // 加载这个资源块的所有文件
            // filename: 'sale.html',
        }),
    ]
}
// 关于同步加载和异步加载
// 同步的代码会被合成并且打包在一起；
// 异步加载的代码会被分片成一个个chunk，在需要该模块时再加载，即按需加载