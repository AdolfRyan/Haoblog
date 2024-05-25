// https://umijs.org/config/
// Umi配置文件
// Umi配置文件
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  // base: '/admin/'：这个配置设置了应用的基础路径为 /admin。这意味着所有的路由都会在这个基础路径之后。
  // 例如，路由 /article 实际上会变成 /admin/article。
  base: '/admin/',
  devServer: { https: false, port: 3002 },
  publicPath: process.env.EEE === 'production' ? '/admin/' : '/',
  antd: {},
  dva: {
    hmr: true,
  },
<<<<<<< HEAD
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
=======
  layout: { //  布局配置，包括侧边栏宽度等
    // https://v3.umijs.org/zh-CN/plugins/plugin-layout
>>>>>>> 5078213d (增加了admin后台调试代码+注释+图标)
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
