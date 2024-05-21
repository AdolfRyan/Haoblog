// Umi前端框架：https://umijs.org/config/

// 引入 umi 中的 defineConfig 方法
import { defineConfig } from 'umi';
export default defineConfig({
  // 插件配置
  plugins: [
    // react-dev-inspector 插件：https://github.com/zthxxx/react-dev-inspector
    // 在开发环境下实现 React 组件的实时检查和调试
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  inspectorConfig: {
    // exclude 表示需要排除检查的文件或目录，这里为空数组，即不排除任何文件
    exclude: [],
    // 配置 Babel（JavaScript 编译器） 相关选项，这里都为空对象，表示使用默认配置
    babelPlugins: [],
    babelOptions: {},
  },
});
