const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

//开启js模块的HMR 需要webpack
const webpack = require("webpack");

//1.准点下课
//2.一步步的搭建项目的框架，落地工程化思想
//3.从零开始
// 技术选型：
//     移动端 还是 PC
//     MPA 还是 SPA
//     html 原生 模板引擎
//     css 原生 预处理器（css3 自动补齐前缀，自适应布局）
//     图片：jpg jpeg png webp ,第三方字体 svg...
//     js ES6+
//     本地开发服务（数据模拟 ）
//     React Vue
//     多人项目 还是 单人项目 需不要指定语法规范
//     单元测试
//     提交规范
//     ....
// 以上的问题通过构建工具帮助我们解决

//mpa多页面打包通用方案

const setMPA = () => {
  const entry = {};
  const htmlwebpackplugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  //   console.log(entryFiles);
  //   [
  //     "/Users/kele/Desktop/webpack17/webpack-17-2/src/detail/index.js",
  //     "/Users/kele/Desktop/webpack17/webpack-17-2/src/home/index.js",
  //     "/Users/kele/Desktop/webpack17/webpack-17-2/src/list/index.js",
  //   ];
  entryFiles.map((item, index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js$/);
    const pageName = match && match[1];
    // console.log(pageName);
    entry[pageName] = entryFile;
    htmlwebpackplugins.push(
      new htmlWebpackPlugin({
        template: path.join(__dirname, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
      })
    );
  });
  // ....
  return {
    entry,
    htmlwebpackplugins,
  };
};

const { entry, htmlwebpackplugins } = setMPA();

module.exports = {
  // entry: "./src/index.js", //main
  entry: {
    main: "./src/index.js",
    list: "./src/list.js",
    detail: "./src/detail.js",
  },
  // entry,
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]_[chunkhash:6].js",
    //给输出资源添加url字符的，定向CDN
    //公司有自己的cdn服务器：http://cdn.kaikeba.com/assets/
    // publicPath: "http://cdn.kaikeba.com/assets/",
    //生产模式使用 省去我们自己给静态资源加服务器的url了。
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        // include: ["", "", ""],
        include: path.resolve(__dirname, "./src"), //推荐使用include
        // exclude: path.resolve(__dirname, "./node_modules"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          // "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
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
  devtool: "inline-source-map",
  //配置webpack-dev-server服务的字段
  // devServer: {
  //   contentBase: "./dist",
  //   port: 8081,
  //   open: true,
  //   hot: true, //开启HMR
  //   hotOnly: true, //关闭浏览器自动刷新
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:9092",
  //     },
  //   },
  // },
  plugins: [
    // ...htmlwebpackplugins,
    new htmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["main"],
      //html压缩
      minify: {
        removeComments: true, //移除注释
        collapseWhitespace: true,
        minifyCSS: true, //压缩内联的css
      },
    }),
    new htmlWebpackPlugin({
      template: "./src/index.html",
      filename: "list.html",
      chunks: ["list"],
    }),
    new htmlWebpackPlugin({
      template: "./src/index.html",
      filename: "detail.html",
      chunks: ["detail"],
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
    new CleanWebpackPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
  ],
};
