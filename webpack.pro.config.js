//生产配置
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseConfig = require("./webpack.base.config");
const merge = require("webpack-merge");

const proConfig = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "./build"),
    publicPath: "http://cdn.kaikeba.com/assets/",
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"), //推荐使用include
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        include: path.resolve(__dirname, "./src"), //推荐使用include
        use: ["file-loader"],
      },
    ],
  },

  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        removeComments: true, //移除注释
        collapseWhitespace: true,
        minifyCSS: true, //压缩内联的css
      },
    }),

    new MiniCssExtractPlugin({
      //容易造成对应层级问题
      filename: "css/[name]_[contenthash:6].css",
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: { removeAll: true },
      },
    }),
  ],
};

module.exports = merge(baseConfig, proConfig);
