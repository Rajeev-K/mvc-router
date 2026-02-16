const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: { main: "./Client/BankApp.ts" },
    devtool: false,
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "wwwroot"),
        publicPath: '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".scss"]
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /wwwroot/]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            fallback: 'file-loader',
                            outputPath: "webpack-images"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
            fallbackModuleFilenameTemplate: '[absolute-resource-path]',
            moduleFilenameTemplate: '[absolute-resource-path]'
        })
    ],
    devServer: {
        static: path.join(__dirname, 'wwwroot'),
        port: 9000
    }
};
