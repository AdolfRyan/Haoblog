import Footer from '@/components/Footer';
import { HomeOutlined, LogoutOutlined, ProjectOutlined } from '@ant-design/icons';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import { message, Modal, notification } from 'antd';
import moment from 'moment';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import LogoutButton from './components/LogoutButton';
import ThemeButton from './components/ThemeButton';
import { fetchAllMeta } from './services/van-blog/api';
import { checkUrl } from './services/van-blog/checkUrl';
import { beforeSwitchTheme, getInitTheme, mapTheme } from './services/van-blog/theme';

// 检查环境是否为开发环境
const isDev = process.env.UMI_ENV === 'dev';
// 登录路径
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

//用于获取应用的初始状态。它首先尝试获取所有元数据，然后根据返回的状态码进行不同的处理。
//如果用户未登录或在初始化页面，它会跳过错误处理。它还检查返回的基础URL是否合法，如果不合法，会弹出警告模态框。
//最后，它检查应用的版本，如果有新版本，会弹出通知
export async function getInitialState() {
  const fetchInitData = async (option) => {
    try {
      // 尝试免密登录
      const msg = await fetchAllMeta(option);
      if (msg.statusCode == 233) {  //  需要初始化
        history.push('/init');
        return msg.data || {};
      } else if (history.location.pathname == '/init' && msg.statusCode == 200) { //  已初始化
        history.push('/');  //
      }
      return msg.data;
    } catch (error) { //  登录失败
      // console.log('fet init data error', error);
      history.push(loginPath);  //  重新登录
      return {};
    }
  }; // 如果不是登录页面，执行
  let option = {};
  // 检查当前路径是否为登录路径或初始化路径，或者本地存储中是否没有token
  if (
    history.location.pathname == loginPath || // 当前路径是登录路径
    history.location.pathname == '/init' || // 当前路径是初始化路径
    !localStorage.getItem('token') // 本地存储中没有token
  ) {
    // 如果上述条件之一成立，设置选项以跳过错误处理程序
    option.skipErrorHandler = true;
  }
  // 使用选项获取初始数据
  const initData = await fetchInitData(option);

  // 从初始数据中解构需要的字段
  const { latestVersion, updatedAt, baseUrl, allowDomains, version } = initData;

  // 检查 baseUrl 是否存在且有效
  if (baseUrl && !checkUrl(baseUrl)) {
    // 如果 baseUrl 不合法，显示一个模态警告框
    Modal.warn({
      title: '网站 URL 不合法',
      content: (
        <div>
          <p>
            您在站点设置中填写的“网站 URL”不合法，这将导致一些奇怪的问题（比如生成的 RSS 订阅源错误等）
          </p>
          <p>网站 URL 需包含完整的协议。</p>
          <p>例如： https://blog-demo.mereith.com</p>
          <a
            onClick={() => {
              // 用户点击链接后，导航到站点设置页面
              history.push('/site/setting?siteInfoTab=basic');
              return true;
            }}
          >
            前往修改
          </a>
        </div>
      ),
    });
  }
  // 来一个横幅提示
  if (version && latestVersion && version != 'dev') {
    if (version >= latestVersion) {
    } else {
      const skipVersion = localStorage.getItem('skipVersion');
      if (skipVersion != latestVersion) { //  如果之前跳过的版本不是最新版本
        notification.info({ //  提示更新版本
          duration: 3000,
          message: (
            <div>
              <p style={{ marginBottom: 4 }}>有新版本！</p>
              <p style={{ marginBottom: 4 }}>{`当前版本:\t${version}`}</p>
              <p style={{ marginBottom: 4 }}>{`最新版本:\t${latestVersion}`}</p>
              <p style={{ marginBottom: 4 }}>{`更新时间:\t${moment(updatedAt).format(
                'YYYY-MM-DD HH:mm:ss',
              )}`}</p>
              <p style={{ marginBottom: 4 }}>
                {`更新日志:\t`}
                <a
                  target={'_blank'}
                  href="https://vanblog.mereith.com/ref/changelog.html"
                  rel="noreferrer"
                >
                  点击查看
                </a>
              </p>
              <p style={{ marginBottom: 4 }}>
                {`更新方法:\t`}
                <a
                  target={'_blank'}
                  href="https://vanblog.mereith.com/guide/update.html#%E5%8D%87%E7%BA%A7%E6%96%B9%E6%B3%95"
                  rel="noreferrer"
                >
                  点击查看
                </a>
              </p>
              <p style={{ marginBottom: 4 }}>
                PS： 更新后如后台一直 loading 或出现 Fetch error 请手动清理一下浏览器缓存
              </p>
              <a
                onClick={() => {
                  window.localStorage.setItem('skipVersion', latestVersion);
                  message.success('跳过此版本成功！下次进入后台将不会触发此版本的升级提示');
                  const el = document.querySelector('.ant-notification-notice-close-x');
                  if (el) {
                    el.click();
                  }
                }}
              >
                跳过此版本
              </a>
            </div>
          ),
        });
      }
    }
  }
  // 暗色模式
  const theme = getInitTheme();
  const sysTheme = mapTheme(theme);


  return {
    fetchInitData, // 包含 fetchInitData 函数，供其他地方使用
    ...initData, // 展开初始数据
    settings: { ...defaultSettings, navTheme: sysTheme }, // 包含默认设置，并应用映射后的系统主题
    theme, // 包含当前主题
  };
}


/**
 * ProLayout 支持的 API
 * 详见 https://procomponents.ant.design/components/layout
 */


// 根据窗口大小调整头部显示
//处理窗口大小变化，根据窗口宽度的大小决定是否显示头部布局。
const handleSizeChange = () => {
  const headerPoint = 768; // 定义一个阈值，宽度小于 768px 时显示头部
  const show = window.innerWidth > headerPoint ? false : true; // 判断窗口宽度是否超过阈值
  if (show) {
    const el = document.querySelector('header.ant-layout-header'); // 获取头部元素
    if (el) {
      el.style.display = 'block'; // 显示头部
    }
    // console.log('show'); // 显示调试信息（已注释）
  } else {
    const el = document.querySelector('header.ant-layout-header'); // 获取头部元素
    if (el) {
      el.style.display = 'none'; // 隐藏头部
    }
    // console.log('hidden'); // 显示调试信息
  }
};

window.onresize = handleSizeChange; //  窗口大小改变时, 动态调整头部显示

//函数返回一个对象，定义了应用的布局和一些行为。例如，它定义了右侧内容渲染，页脚渲染，
//页面改变时的行为，链接，以及子元素的渲染。它还处理了主题切换和设置更改。
export const layout = ({ initialState, setInitialState }) => {
  handleSizeChange(); //  初始化头部显示状态
  return {
    rightContentRender: () => {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeButton showText={false} />
          <LogoutButton
            key="logoutRightContent"
            trigger={
              <a>
                <LogoutOutlined />
                <span style={{ marginLeft: 6 }}>登出</span>
              </a>
            }
          />
        </div>
      );
    },
    // disableContentMargin: true,
    footerRender: () => {
      // const { location } = history;
      // const disableArr = ['/editor', '/site/comment'];
      // if (disableArr.includes(location.pathname)) {
      //   return false;
      // }
      // 目前 footer 只有发 console.log 一个功能了。
      return <Footer />;
    },

    // 页面变化时执行的操作
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (location.pathname === '/init' && !initialState?.user) {
        return;
      }
      if (!initialState?.user && ![loginPath, '/user/restore'].includes(location.pathname)) {
        history.push(loginPath);
      }
      // 若当前路径是登录页面, 且用户已登录，重定向到主页
      if (location.pathname == loginPath && Boolean(initialState?.user)) {
        history.push('/');
      }
    },

    // 侧边栏导航
    links: [
      <a key="mainSiste" rel="noreferrer" target="_blank" href={'/'}>
        <HomeOutlined />
        <span>主站</span>
      </a>,
      <Link key="AboutLink" to={'/about'}>
        <ProjectOutlined />
        <span>关于</span>
      </Link>,
      <ThemeButton key="themeBtn" showText={true} />,
      <LogoutButton
        key="logoutSider"
        trigger={
          <a>
            <LogoutOutlined />
            <span>登出</span>
          </a>
        }
      />,
    ],

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态

    // 渲染子组件并添加设置抽屉
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              // colorList={false}
              settings={initialState?.settings}
              // themeOnly={true}
              onSettingChange={(settings) => {
                const user = initialState?.user;
                const isCollaborator = user?.type && user?.type == 'collaborator';
                if (isCollaborator) {
                  settings.title = '协作模式';
                }
                if (settings.navTheme != initialState?.settings?.navTheme) {
                  // 切换了主题
                  beforeSwitchTheme(settings.navTheme);
                }
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          }
        </>
      );
    },

    ...initialState?.settings,
  };
};
// 配置请求相关设置
//定义了请求的错误配置和请求拦截器。错误配置中，
//根据返回的状态码和消息，定义了成功和错误消息。请求拦截器在发送请求前，将token添加到请求头中。
export const request = {
  // 错误处理配置
  errorConfig: {
    adaptor: (resData) => {
      // 提取错误消息
      let errorMessage = resData.message;
      // 判断请求是否成功
      let success = resData?.statusCode == 200 || resData?.statusCode == 233;
      // 如果状态码为 401 且消息为 'Unauthorized'，设置错误消息为 '登录失效'
      if (resData?.statusCode == 401 && resData?.message == 'Unauthorized') {
        errorMessage = '登录失效';
      }
      // 如果错误消息为 'Forbidden resource'，设置错误消息为 '权限不足！'
      if (errorMessage == 'Forbidden resource') {
        errorMessage = '权限不足！';
      }
      // 返回处理后的响应数据，包括成功状态和错误消息
      return {
        ...resData,
        success,
        errorMessage,
      };
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (url, options) => {
      // 返回拦截后的请求配置
      return {
        url: url,
        options: {
          ...options,
          interceptors: true,
          headers: {
            // 从本地存储中获取 token，并添加到请求头中
            token: (() => {
              return window.localStorage.getItem('token') || 'null';
            })(),
          },
        },
      };
    },
  ],
  // 响应拦截器（注释掉的部分）
  // responseInterceptors: [
  //   response => {
  //     if (response.statusCode === 233) {
  //       console.log("go to init!")
  //       // window.location.pathname = '/init'
  //       history.push('/init')
  //       return response
  //     } else {
  //       return response
  //     }
  //   }
  // ]
};
