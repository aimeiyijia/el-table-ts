module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/el-table-ts/' : '/',
  css: {
    extract: false,
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('tsx')
      .test(/\.tsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      // 你还可以再添加一个 loader
      .use('ts-loader')
      .loader('ts-loader')
      .end()
  },
}
