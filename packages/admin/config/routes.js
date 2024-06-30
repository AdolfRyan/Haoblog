// 定义路由配置
export default [
  {
    path: '/user',
    layout: false, // 不使用默认布局
    routes: [
      { name: '登录', path: '/user/login', component: './user/Login' }, // 登录页面
      { name: '忘记密码', path: '/user/restore', component: './user/Restore' }, // 忘记密码页面
      { component: './404' }, // 404页面，匹配不到路由时显示
    ],
  },
  { path: '/init', layout: false, component: './InitPage' }, // 初始化页面
  {
    path: '/welcome',
    name: '分析概览',
    icon: 'smile',
    component: './Welcome',
    access: 'isAdmin', 
  },
  { name: '文章管理', icon: 'form', path: '/article', component: './Article' }, // 文章管理页面
  {
    name: '图形编辑器',
    icon: 'form',
    path: '/editor',
    component: './Editor',
    hideInMenu: true, // 在菜单中隐藏
  },
  {
    name: '代码编辑器',
    icon: 'tool',
    path: '/code',
    component: './Code',
    hideInMenu: true, // 在菜单中隐藏
    access: 'isAdmin', // 仅管理员可访问
  },
  {
    name: '关于',
    icon: 'form',
    path: '/about',
    component: './About',
    hideInMenu: true, // 在菜单中隐藏
  },
  { name: '草稿管理', icon: 'container', path: '/draft', component: './Draft' }, // 草稿管理页面
  {
    name: '图片管理',
    icon: 'picture',
    path: '/static/img',
    hideInBreadcrumb: true, // 在面包屑中隐藏
    component: './Static/img',
  },

  {
    name: '站点管理',
    icon: 'tool',
    path: '/site',
    hideInBreadcrumb: true, // 在面包屑中隐藏
    access: 'isAdmin', // 仅管理员可访问
    routes: [
      { name: '数据管理', path: '/site/data', component: './DataManage' }, // 数据管理页面
      { name: '评论管理', path: '/site/comment', component: './CommentManage' }, // 评论管理页面
      { name: '系统设置', path: '/site/setting', component: './SystemConfig' }, // 系统设置页面
      {
        name: '自定义页面',
        path: '/site/customPage',
        component: './CustomPage',
      },
      { name: '日志管理', path: '/site/log', component: './LogManage' }, // 日志管理页面
    ],
  },

  { path: '/', redirect: '/article' }, // 默认重定向到文章管理页面
  { component: './404' }, // 404页面，匹配不到路由时显示
];
