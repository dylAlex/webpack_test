module.exports = {
  //处理css 成ast抽象语法树，如何把这个抽象语法树转换成相应的css?
  //postcss 插件机制
  plugins: [
    require("autoprefixer")({
      //pxtorem
      //postcss-plugin-px2rem
      overrideBrowserslist: ["last 2 versions", ">1%"], //面向全球
    }),
  ],
};
