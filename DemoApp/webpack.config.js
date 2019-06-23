const path = require('path');

module.exports = {
    entry: "./Client/BankApp.ts",
    devtool: 'source-map',
    output: {
        filename: "[name].module.js",
        path: path.resolve(__dirname, "wwwroot")
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
    devServer: {
        contentBase: path.join(__dirname, 'wwwroot'),
        port: 9000
    }
};
