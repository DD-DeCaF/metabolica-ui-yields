const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new ExtractTextPlugin('[chunkhash].[name].css'),
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
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: [
                        'transform-runtime'
                    ]
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
};
