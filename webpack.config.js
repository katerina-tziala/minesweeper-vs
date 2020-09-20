const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevServer = require.main.filename.includes('webpack-dev-server');

const plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html")
    }),
    // new MiniCssExtractPlugin(),
    //new webpack.SourceMapDevToolPlugin({})
];

if (isDevServer) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    entry: {
        index: path.resolve(__dirname, "src", "index.js")
    },
    output: {
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        noEmitOnErrors: true,
        minimize: true,
        minimizer: [
            new UglifyJsPlugin()
        ],
        usedExports: true,
        sideEffects: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sass|scss|css)$/,
                use: ['style-loader', 'css-loader?sourceMap', 'resolve-url-loader', 'sass-loader']
            },
            {
                test: /\.(ttf|eot|woff|woff2|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000,
                        name: "[name]-[hash].[ext]",
                        outputPath: (url, resourcePath, context) => {
                            if (resourcePath.match("fonts/nunito")) {
                                return `./assets/fonts/nunito/${url}`;
                            }
                            if (resourcePath.match("fonts/fontawesome")) {
                                return `./assets/fonts/fontawesome/${url}`;
                            }
                        }
                    },
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 100000,
                            name: "[name]-[hash].[ext]",
                            outputPath: (url, resourcePath, context) => {
                                if (resourcePath.match("fonts/nunito")) {
                                    return `./assets/fonts/nunito/${url}`;
                                }
                                if (resourcePath.match("fonts/fontawesome")) {
                                    return `./assets/fonts/fontawesome/${url}`;
                                }
                            }
                        }
                    }
                ]
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,
            //         'css-loader'
            //     ]
            // }
        ]
    },
    plugins,
    devServer: {
        hot: true,
    },
    devtool: 'source-map',
};