// https://umijs.org/config/
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';  // 导入默认设置（同目录下defaultSetting.js文件)
import proxy from './proxy';    //  导入代理配置（同目录下proxy.js文件)
import routes from './routes';  //  导入路由配置（同目录下routes.js文件)
const { REACT_APP_ENV } = process.env;  //  从环境变量中获取 REACT_APP_ENV (process 是 Node.js 的全局对象)

// 导出默认配置
export default defineConfig({
  hash: true, //  生成 hash 文件名，用于版本管理
  base: '/admin/',  //  项目的基本路径
  devServer: { https: false, port: 3002 },  //  开发服务器配置 3002为后台端口
  publicPath: process.env.EEE === 'production' ? '/admin/' : '/', // 根据环境变量设置的 publicPath
  antd: {},
  dva: {
    hmr: true,
  },
  layout: { //  布局配置，包括侧边栏宽度等
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    memo
      .plugin('monaco-editor-webpack-plugin')
      .use(MonacoWebpackPlugin, [
        { languages: ['css', 'json', 'html', 'javascript', 'typescript'] },
      ]);
  },
});
