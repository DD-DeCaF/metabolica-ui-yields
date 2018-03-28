const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');


module.exports = function () {
	return {
		entry: {
			main: './src/index.js'
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				minSize: 0,
				maxAsyncRequests: Infinity,
				maxInitialRequests: Infinity,
				name: true,
				cacheGroups: {
					default: {
						chunks: 'async',
						minSize: 30000,
						minChunks: 2,
						maxAsyncRequests: 5,
						maxInitialRequests: 3,
						priority: -20,
						reuseExistingChunk: true,
					},
					vendors: {
						name: 'vendor',
						enforce: true,
						test: function (module) {
							return (
								module.context
								&& module.context.indexOf('node_modules') !== -1
							);
						},
						priority: -10,
						reuseExistingChunk: true,
					},
					commons: {
						name: 'manifest',
						chunks: 'initial',
						minChunks: 2,
						test: function (module) {
							return module.context && module.context.indexOf('metabolica') === -1;
						},
						priority: -5,
						reuseExistingChunk: true,
					},
				},
			}
		},
		output: {
			filename: '[chunkhash].[name].js',
			path: path.resolve(__dirname, 'dist')
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js']
		},
		node: {
			fs: "empty"
		},
		plugins: [
			/* new webpack.optimize.CommonsChunkPlugin({
				names: ['vendor', 'manifest'],
				minChunks: function (module) {
					return module.context
						&& module.context.indexOf('node_modules') !== -1
						&& module.context.indexOf('metabolica') === -1;
				}
			}), */
			new ExtractTextPlugin('[chunkhash].[name].css'),
			new HtmlWebpackPlugin({
				inject: 'head',
				template: './src/index.html',
				filename: 'index.html'
			})
		],
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: 'css-loader'
					})
				},
				{
					test: /\.scss$/,
					include: [
						path.resolve(__dirname, 'src'),
						path.dirname(require.resolve('metabolica'))
					],
					use: ExtractTextPlugin.extract({
						use: [{
							loader: 'css-loader'
						}, {
							loader: 'sass-loader'
						}]
					})
				},
				{
					test: /\.js$/,
					include: [
						path.resolve(__dirname, 'src'),
						path.dirname(require.resolve('metabolica'))
					],
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: [require('@babel/plugin-transform-runtime')]
						}
					}
				},
				{
					test: /\.html$/,
					loader: 'html-loader'
				},
				{
					test: /\.(jpe?g|png|svg)$/,
					loader: 'file-loader?name=[path][name].[ext]'
				},
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					include: [
						path.resolve(__dirname, 'src'),
						__dirname
					]
				}
			]
		},
		devServer: {
			historyApiFallback: true,
			proxy: {
				'/api': {
					// Set the following line to the address of the API you want to test against:
					target: 'https://iloop-staging.dd-decaf.eu',
					secure: false,
					changeOrigin: true
				}
			}
		}
	}
};
