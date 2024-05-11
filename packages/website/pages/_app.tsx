import "../styles/globals.css";
import "../styles/side-bar.css";
import "../styles/toc.css";
import "../styles/var.css";
import "../styles/github-markdown.css";
import "../styles/tip-card.css";
import "../styles/loader.css";
import "../styles/scrollbar.css";
import "../styles/custom-container.css";
import "../styles/code-light.css";
import "../styles/code-dark.css";
import "../styles/zoom.css";
import type { AppProps } from "next/app";
import { GlobalContext, GlobalState } from "../utils/globalContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getPageview, updatePageview } from "../api/pageview";
import Head from "next/head";
//函数组件，Component 是当前页面组件，pageProps 是页面组件的 props。
function MyApp({ Component, pageProps }: AppProps) {
  const { current } = useRef({ hasInit: false });

  const [globalState, setGlobalState] = useState<GlobalState>({
    viewer: 0,
    visited: 0,
  });

  //路由处理
  const router = useRouter();
  //重新加载页面，访客信息
  const reloadViewer = useCallback(
    async (reason: string) => {
      const pathname = window.location.pathname;
      if (window.localStorage.getItem("noViewer")) {
        const { viewer, visited } = await getPageview(pathname)
        setGlobalState({ ...globalState, viewer: viewer, visited: visited });
        return;
      } else {
        console.log("[更新访客]", reason, pathname);
        const { viewer, visited } = await updatePageview(pathname);
        setGlobalState({ ...globalState, viewer: viewer, visited: visited });
      }

    },
    [globalState, setGlobalState]
  );
  const handleRouteChange = (
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    reloadViewer(`页面跳转`);
  };
  //检测是否初始化，监测是否有路由变化
  useEffect(() => {
    if (!current.hasInit) {
      current.hasInit = true;
      reloadViewer("初始化");
      router.events.on("routeChangeComplete", handleRouteChange);
    }
  }, [current, reloadViewer]);

  //返回一个 React 组件的 JSX 结构。这个结构包含了一些 HTML 元素和 React 组件。
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <GlobalContext.Provider
        value={{ state: globalState, setState: setGlobalState }}
      >
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </>
  );
}

export default MyApp;
