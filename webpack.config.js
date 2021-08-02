const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config();

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'mtfh',
        projectName: 'property',
        webpackConfigEnv,
        argv,
    });

    return merge(defaultConfig, {
        module: {
            rules: [
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        { loader: 'css-loader', options: { sourceMap: false } },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: false },
                        },
                    ],
                },
            ],
        },
        // resolve: {
        //     alias:
        //         '@components': path.resolve(__dirname, 'src/components'),
        //         '@services': path.resolve(__dirname, 'src/services'),
        //         '@utilities': path.resolve(__dirname, 'src/utils'),
        //     },
        //     extensions: ['.ts', '.tsx', '.js'],
        // },
        externals: ['@mtfh/common', 'react-router-dom'],
        plugins: [
            new webpack.EnvironmentPlugin({
                APP_ENV: dotenv.APP_ENV || 'dev',
                PROPERTY_API_URL: dotenv.PROPERTY_API_URL || '',
            }),
        ],
    });
};
