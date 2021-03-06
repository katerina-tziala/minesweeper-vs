const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevServer = require.main.filename.includes('webpack-dev-server');

const plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html')
    }),
    // new MiniCssExtractPlugin(),
    //new webpack.SourceMapDevToolPlugin({})
];

if (isDevServer) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
}



module.exports = {
    resolve: {
        extensions: ['.js'],
        alias: {
            ['~']: path.resolve(__dirname, 'src/app'),
            ['styles']: path.resolve(__dirname, 'src/styles'),
            UI_ELEMENTS: path.resolve(__dirname, 'src/app/ui-elements/@ui-elements.module.js'),
            UTILS: path.resolve(__dirname, 'src/app/utils/@utils.module.js'),
            ONLINE_CONNECTION: path.resolve(__dirname, 'src/app/state-controllers/online-connection/@online-connection.module.js'),
            PAGES: path.resolve(__dirname, 'src/app/pages/@pages.module.js'),
            GAME_ENUMS: path.resolve(__dirname, 'src/app/game/_enums/@game-enums.module.js'),
            GAME_SETTINGS: path.resolve(__dirname, 'src/app/game/game-settings/@game-settings.module.js'),
            GAME_WIZARD: path.resolve(__dirname, 'src/app/game/game-wizard/@game-wizard.module.js'),

        }
    },
    entry: {
        index: path.resolve(__dirname, 'src', 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
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
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        name: '[name]-[hash].[ext]',
                        outputPath: (url, resourcePath, context) => {
                            if (resourcePath.match('fonts/nunito')) {
                                return `./assets/fonts/nunito/${url}`;
                            }
                            if (resourcePath.match('fonts/fontawesome')) {
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
                            name: '[name]-[hash].[ext]',
                            outputPath: (url, resourcePath, context) => {
                                if (resourcePath.toString().match('nunito')) {
                                    return `./assets/fonts/nunito/${url}`;
                                }
                                if (resourcePath.match('fontawesome')) {
                                    return `./assets/fonts/fontawesome/${url}`;
                                }
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins,
    devServer: {
        hot: true,
        watchContentBase: true
    },
    devtool: 'source-map',
};