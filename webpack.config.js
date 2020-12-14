const path = require('path');
const htmlPlugin = require('html-webpack-plugin');
const terser = require('terser-webpack-plugin');
const webpackFriendlyMessage = require('friendly-errors-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpackPWA = require("webpack-pwa-manifest");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = function (env) {
    const projectPath = env.project === 'extension' ? 'extension' : 'www';

    const defaultPlugins = [
        new htmlPlugin({
            inject: true,
            template: "./public/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        new webpackFriendlyMessage({
            compilationSuccessInfo: {
                messages: ['You application is running here http://localhost:8080']
            },
        }),
        new ScriptExtHtmlWebpackPlugin({
            prefetch: [/\.js$/],
            defaultAttribute: 'async'
        }),
        new webpackPWA({
            name: 'Hello World',
            short_name: 'Hello World',
            description: 'Your PWA App',
            theme_color: '#212121',
            background_color: '#212121'
        }),
        new VueLoaderPlugin()
    ]

    const pluginsDev = [];

    return {
        target: 'web',
        entry: {
            index: projectPath === 'extension' ? path.resolve(__dirname, 'extension', 'src', 'popup.js') : path.resolve(__dirname, 'www', 'index.js')
        },
        output: {
            path: path.resolve(__dirname, projectPath, "dist"),
            filename: "js/[name].[hash].bundle.js"
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            minimizer: [
                new terser({
                    terserOptions: {
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        parse: {
                            ecma: 8
                        },
                        mangle: { safari10: true },
                        output: {
                            ecma: 5,
                            safari10: true,
                            comments: false,
                            ascii_only: true
                        }
                    },
                    parallel: true
                })
            ],
        },
        devServer: {
            contentBase: path.resolve("public"),
            compress: true,
            port: 8080,
            disableHostCheck: true,
            historyApiFallback: true,
            quiet: true
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader',
                        options: {
                            source: 'www',
                            img: 'www',
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@vue/babel-preset-jsx']
                        }
                    }
                },
                {
                    test: /\.(jpg|png|svg|jpeg|gif)$/,
                    use: [{
                        loader: "file-loader",
                        options: { name: "[name].[ext]", outputPath: "img/" }
                    }]
                }
            ]
        },
        plugins: env.mode === "development" ? [...defaultPlugins, ...pluginsDev] : [...defaultPlugins]
    }
}