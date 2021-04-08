module.exports = {
  lintOnSave: false,
  devServer: {
    host: "0.0.0.0",
    port: 81,
    https: false,
    proxy: {
      "/api": {
        //这里最好有一个 /
        target: "https://alongz.cn", // 后台接口域名
        ws: true, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": "" //需要rewrite的,
        }
      }
    }
  }
};
