const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const fileName = ext => isDev ? `bundle.${ext}` : `bundle[hash].${ext}`;

const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env']
			}
		}
	];
	if (isDev) {
		loaders.push({loader: 'tslint-loader', options: {presets: ['tslint-loader']}});
	} else {
		return loaders;
	}

	module.exports = {
		context: path.resolve(__dirname, 'src'),
		mode: 'development',
		entry: ['@babel/polyfill', './index.ts'],
		resolve: {
			extensions: ['.js'],
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@core': path.resolve(__dirname, 'src/core')
			}
		},
		output: {
			filename: fileName('js'),
			path: path.resolve(__dirname, 'dist/')
		},
		devtool: isDev ? 'source-map' : false,
		devServer: {
			port: 3000,
			hot: isDev
		},
		plugins: [
			new CleanWebpackPlugin(),
			// new CopyPlugin({
			// 	patterns: [{
			// 		from: path.resolve(__dirname, 'src/favicon.ico'),
			// 		to: path.resolve(__dirname, 'dist')
			// 	}]
			// }),
			new MiniCssExtractPlugin({
				filename: fileName('css')
			}),
			new HtmlWebpackPlugin({
				template: 'index.html',
				minify: {
					removeComments: isProd,
					collapseWhitespace: isProd
				}
			})
		],
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: jsLoaders()
				},
				{
					test: /\.html$/i,
					loader: 'html-loader'
				},

				{
					test: /\.s[ac]ss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader',
					],
				}
			],
		},
	};
};
