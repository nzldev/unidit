/*!
 * Unidit Editor (https://nazrul.dev/packages/unidit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2021-2022 Nazrul Islam. All rights reserved. https://nazrul.dev
 */
// @ts-check
/** eslint-disable tsdoc/syntax */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinimizeJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const postcss = require('postcss');
const { variables } = require('./variables');
const { fileName } = require('./utils/filename');

/**
 * @param {boolean} onlyTS - build only TypeScript files
 */
module.exports = (env, argv, dir = process.cwd(), onlyTS = false) => {
	const vars = variables(argv, dir);

	const { ES, mode, isTest, isProd, debug, ESNext, uglify, outputPath } =
		vars;

	console.warn(`ES:${ES} Mode:${mode} Test:${isTest} Uglify:${uglify}`);

	return {
		cache: !isProd,
		mode,
		target: ['web', 'es5'],
		context: dir,

		stats: {
			colors: true
		},

		devtool: debug ? 'inline-source-map' : false,

		entry: {
			unidit: debug
				? ['webpack-hot-middleware/client.js', './src/index']
				: ['./src/index']
		},

		output: {
			path: outputPath,
			filename: fileName(vars)('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
		},

		resolve: {
			extensions: ['.js', '.ts', '.d.ts', '.json', '.less', '.svg'],
			alias: {
				'unidit/src': path.resolve(__dirname, '../src/'),
				unidit: path.resolve(__dirname, '../src/')
			}
		},

		optimization: {
			minimize: !debug && uglify,
			moduleIds: debug ? 'named' : 'natural',
			minimizer: require('./minimizer').map(mnm =>
				mnm({ isTest, ESNext })
			)
		},

		module: {
			rules: require('./rules/index')(vars)
		},

		plugins: require('./plugins/index')(vars)
	};
};
