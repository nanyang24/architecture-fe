const path = require('path');
const baseWebpackConfig = require('./base.config.js');

const devWebpackPartialConfig = {
    watch: true,                                      // 让webpack以watch模式运行，实时监测编译文件。也可以在package.json的script加 -w
    devServer: {                                      // webpack-dev-server
        contentBase: path.join(process.cwd(), "sample"),    // 指定起始目录
        compress: true,                               //
        port: 9000
    },
};

module.exports = Object.assign({},
    baseWebpackConfig,
    devWebpackPartialConfig);