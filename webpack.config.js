let webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './views',    //本地服务器加载的页面所在的目录
        inline: true,              //实时刷新
        historyApiFallback: true,  //所有跳转都将指向index.html，页面不跳转
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