const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js", //main

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]_[chunkhash:6].js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        include: path.resolve(__dirname, "./src"), //推荐使用include

        //file-loader .txt .md .png .word .pdf
        // use: {
        //   //   loader: "file-loader",
        //   loader: "url-loader",
        //   options: {
        //     name: "[name]_[hash:8].[ext]",
        //     outputPath: "images/",
        //     limit: 1024, // 转为base64的格式，放入bundle.js文件中
        //   },
        // },
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        include: path.resolve(__dirname, "./src"), //推荐使用include
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash:6].[ext]",
            outputPath: "iconfont/",
            limit: 1024, // 转为base64的格式，放入bundle.js文件中
          },
        },
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"), //推荐使用include
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    //定位第三方依赖的位置
    modules: [path.resolve(__dirname, "./node_modules")],
    alias: {
      //给图片起个别名，注意html css里的使用
      "@assets": path.resolve(__dirname, "./src/images"),
    },
    //后缀列表,缺点：这个列表越长，需要匹配的时间就越久，所以推荐大家使用后缀！
    extensions: [".js", ".json", ".jsx"],
  },

  plugins: [new CleanWebpackPlugin()],
};
