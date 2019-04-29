let webpack = require('webpack');
let HTMLWebpackPlugin = require('html-webpack-plugin');
let path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',
    entry: __dirname + '/src/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),    //本地服务器加载的页面所在的目录
        port: 3000,                //默认3000
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: { 
                    loader: 'babel-loader'
                },
                exclude: __dirname + 'node_modules'
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
                exclude: __dirname + 'node_modules'
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        outputPath: 'assets/',
                        name: '[name].[ext]'
                    }
                },
                exclude: __dirname + 'node_modules'
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: 'src/views/index.html'
        })
    ]
}