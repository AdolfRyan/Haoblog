import Footer from '@/components/Footer';
import { HomeOutlined, LogoutOutlined, ProjectOutlined } from '@ant-design/icons';  //  导入侧边栏需要的图标https://ant.design/components/icon-cn
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';  // https://pro.ant.design/zh-CN/docs/layout/
import { message, Modal, notification } from 'antd';  // https://ant.design/components/message-cn
import moment from 'moment';
import { history, Link } from 'umi';  // Link:https://v3.umijs.org/zh-CN/docs/navigate-between-pages
import defaultSettings from '../config/defaultSettings';
import LogoutButton from './components/LogoutButton'; // 后台登出按钮
import ThemeButton from './components/ThemeButton'; // 后台配色主题按钮
import { fetchAllMeta } from './services/van-blog/api';
import { checkUrl } from './services/van-blog/checkUrl';
import { beforeSwitchTheme, getInitTheme, mapTheme } from './services/van-blog/theme';
const isDev = process.env.UMI_ENV === 'dev';
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
      const msg = await fetchAllMeta(option);
      if (msg.statusCode == 233) {
        history.push('/init');
        return msg.data || {};
      } else if (history.location.pathname == '/init' && msg.statusCode == 200) {
        history.push('/');
      }
      return msg.data;
    } catch (error) {
      // console.log('fet init data error', error);
      history.push(loginPath);
      return {};
    }
  }; // 如果不是登录页面，执行
  let option = {};
  if (
    history.location.pathname == loginPath ||
    history.location.pathname == '/init' ||
    !localStorage.getItem('token')
  ) {
    option.skipErrorHandler = true;
  }
  const initData = await fetchInitData(option);

  const { latestVersion, updatedAt, baseUrl, allowDomains, version } = initData;

  if (baseUrl && !checkUrl(baseUrl)) {
    Modal.warn({
      title: '网站 URL 不合法',
      content: (
        <div>
          <p>
            您在站点设置中填写的“网站 URL”不合法，这将导致一些奇怪的问题（比如生成的 RSS
            订阅源错误等）
          </p>
          <p>网站 URL 需包含完整的协议。</p>
          <p>例如： https://blog-demo.mereith.com</p>
          <a
            onClick={() => {
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
      if (skipVersion != latestVersion) {
        // 老的
        notification.info({
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
    fetchInitData,
    ...initData,
    settings: { ...defaultSettings, navTheme: sysTheme },
    theme,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

//处理窗口大小变化，根据窗口宽度的大小决定是否显示头部布局。
const handleSizeChange = () => {
  const headerPoint = 768;
  const show = window.innerWidth > headerPoint ? false : true;
  if (show) {
    const el = document.querySelector('header.ant-layout-header');
    if (el) {
      el.style.display = 'block';
    }
    // console.log('show');
  } else {
    const el = document.querySelector('header.ant-layout-header');
    if (el) {
      el.style.display = 'none';
    }
    // console.log('hidden');
  }
};

window.onresize = handleSizeChange;
//函数返回一个对象，定义了应用的布局和一些行为。例如，它定义了右侧内容渲染，页脚渲染，
//页面改变时的行为，链接，以及子元素的渲染。它还处理了主题切换和设置更改。
export const layout = ({ initialState, setInitialState }) => {
  handleSizeChange();
  return {
    rightContentRender: () => {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 页面缩放时 右上角的主题按钮 */}
          <ThemeButton showText={false} />
          {/* 页面缩放时，右上角的登出按钮 */}
          <LogoutButton
            key="logoutRightContent"
            trigger={
              <a>
                <LogoutOutlined />
                <span style={{ marginLeft: 100 }}>登出</span>
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
      return <div style={{ textAlign: 'center', padding: '20px 0', background: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ margin: '0 10px' }}>曹钧杰</span>
        <span style={{ margin: '0 10px' }}>陈大钧</span>
        <span style={{ margin: '0 10px' }}>陈浩熙</span>
        <span style={{ margin: '0 10px' }}>江瀚翔</span>
        <span style={{ margin: '0 10px' }}>刘昊</span>
      </div>
    </div>; 
    },
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      console.log("app.jsx onPageChange(): " + JSON.stringify(history, null, 2)); // 添加调试信息

      if (location.pathname === '/init' && !initialState?.user) {
        return;
      }
      if (!initialState?.user && ![loginPath, '/user/restore'].includes(location.pathname)) {
        history.push(loginPath);
      }
      if (location.pathname == loginPath && Boolean(initialState?.user)) {
        history.push('/');
      }
    },
    links: [
      <a key="mainSiste" rel="noreferrer" target="_blank" href={'/'} onClick={() => console.log('Link clicked: mainSiste')}>
        <HomeOutlined />
        <span>主站</span>
      </a>,
      <Link key="AboutLink" to={'/about'} onClick={() => console.log('Link clicked: AboutLink')}>
        <ProjectOutlined />
        <span>关于</span>
      </Link>,
      <ThemeButton key="themeBtn" showText={true} onClick={() => console.log('Link clicked: themeBtn')} />,
      <LogoutButton
        key="logoutSider"
        trigger={
          <a onClick={() => console.log('Link clicked: logoutSider')}>
            <LogoutOutlined />
            <span>登出</span>
          </a>
        }
      />,
    ],

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      console.log("childrenRender");
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
//定义了请求的错误配置和请求拦截器。错误配置中，
//根据返回的状态码和消息，定义了成功和错误消息。请求拦截器在发送请求前，将token添加到请求头中。
export const request = {
  errorConfig: {
    adaptor: (resData) => {
      let errorMessage = resData.message;
      let success = resData?.statusCode == 200 || resData?.statusCode == 233;
      if (resData?.statusCode == 401 && resData?.message == 'Unauthorized') {
        errorMessage = '登录失效';
      }
      if (errorMessage == 'Forbidden resource') {
        errorMessage = '权限不足！';
      }
      return {
        ...resData,
        success,
        errorMessage,
      };
    },
  },
  requestInterceptors: [
    (url, options) => {
      return {
        url: url,
        options: {
          ...options,
          interceptors: true,
          headers: {
            token: (() => {
              return window.localStorage.getItem('token') || 'null';
            })(),
          },
        },
      };
    },
  ],
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
