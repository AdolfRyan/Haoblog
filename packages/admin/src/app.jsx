import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { fetchAllMeta } from './services/van-blog/api';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const basePath = '/';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const fetchInitData = async (option) => {
    try {
      const msg = await fetchAllMeta(option);
      if (msg.statusCode == 233) {
        history.push('/init');
      } else if (window.location.pathname == '/init' && msg.statusCode == 200) {
        history.push('/');
      } else {
        const result = msg.data;
        if (result.articles && result.meta && result.meta.about) {
          result.articles = [
            {
              id: 0,
              category: '关于',
              title: '关于',
              tag: ['关于'],
              about: true,
              content: result.meta.about.content,
              updatedAt:
                result.meta.about.updatedAt || result.meta?.siteInfo?.since || '2022-06-26',
              createdAt: result.meta?.siteInfo?.since || '2022-06-26',
            },
            ...result.articles,
          ];
        }
        return msg.data;
      }
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果不是登录页面，执行
  let option = {};
  if (location.pathname == loginPath || location.pathname == '/init') {
    option.skipErrorHandler = true;
  }
  const initData = await fetchInitData(option);
  return {
    fetchInitData,
    ...initData,
    settings: defaultSettings,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login
      if (location.pathname === '/init' && !initialState?.user) {
        return;
      }
      if (!initialState?.user && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      if (location.pathname == loginPath && Boolean(initialState?.user)) {
        history.push('/');
      }
    },
    links: [
      <a
        key="mainSite"
        onClick={() => {
          window.open(initialState?.meta?.siteInfo?.baseUrl || '/', '_blank');
        }}
        target="_blank"
      >
        <HomeOutlined />
        <span>主站</span>
      </a>,
      <a key="mainSite" href="https://vanblog.mereith.com/" target="_blank" rel="noreferrer">
        <QuestionCircleOutlined />
        <span>帮助文档</span>
      </a>,
    ],

    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
export const request = {
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        success: resData?.statusCode == 200 || resData?.statusCode == 233,
        errorMessage: resData.message,
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
