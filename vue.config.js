const path = require('path')
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/el-table-ts/' : '/',
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.ts', 'tsx', '.vue', '.json'],
    },
    externals: process.env.NODE_ENV === 'development' ? {} : {
      'element-ui': 'element-ui',
      vue: 'vue',
    },
  },
  chainWebpack: config => {
    // These are some necessary steps changing the default webpack config of the Vue CLI
    // that need to be changed in order for Typescript based components to generate their
    // declaration (.d.ts) files.
    //
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('mock', path.resolve('mock'))
    // Discussed here https://github.com/vuejs/vue-cli/issues/1081
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('ts').uses.delete('cache-loader')
      config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap(opts => {
          opts.transpileOnly = false
          opts.happyPackMode = false
          return opts
        })
    }
  },
  parallel: false,
}
