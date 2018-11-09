let webpack = require('webpack');
let path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'views'),    //本地服务器加载的页面所在的目录
        port: 3000,                //默认8080
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: { loader: 'babel-loader' },
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { 
                        loader: 'css-loader' ,
                        options: {
                            modules: true,     //指定启用css module
                            localIndentName: '[name]_[local]_[hash:base64:5]'   //指定css的类名格式
                        }
                    },
                    { loader: 'postcss-loader' },
                    { loader: 'less-loader' }
                ],
                exclude: /node_modules/
            }
        ]
    }
}