const { ImportMapWebpackPlugin } = require("@hackney/webpack-import-map-plugin");
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const { merge } = require("webpack-merge");

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: "mtfh",
        projectName: "property",
        webpackConfigEnv,
        argv,
    });

  return merge(defaultConfig, {
    entry: {
      property: defaultConfig.entry,
    },
    output: {
      filename: "[name].[contenthash].js",
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [
            "style-loader",
            { loader: "css-loader", options: { sourceMap: false } },
            {
              loader: "sass-loader",
              options: { sourceMap: false },
            },
          ],
        },
      ],
    },
    externals: ["react-router-dom", "formik", "yup"],
    plugins: [
      new ImportMapWebpackPlugin({
        namespace: "@mtfh",
        basePath: process.env.APP_CDN || "http://localhost:8010",
      }),
      new webpack.EnvironmentPlugin({
        APP_ENV: process.env.APP_ENV || "development",
      }),
    ],
    loaders: [
      { test: /\.js$/, loader: 'babel', query: {compact: false} }
    ]
  });
};
