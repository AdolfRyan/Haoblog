// 页面主要布局
import Head from "next/head";
import BackToTopBtn from "../BackToTop";
import NavBar from "../NavBar";
import { useEffect, useRef, useState } from "react";
import BaiduAnalysis from "../BaiduAnalysis";
import GaAnalysis from "../gaAnalysis";
import { LayoutProps } from "../../utils/getLayoutProps";
// import ImageProvider from "../ImageProvider";
import { RealThemeType, ThemeContext } from "../../utils/themeContext";
import { getTheme } from "../../utils/theme";
import CustomLayout from "../CustomLayout";
import { Toaster } from "react-hot-toast";
import Footer from "../Footer";
import NavBarMobile from "../NavBarMobile";
import LayoutBody from "../LayoutBody";
export default function (props: {
  option: LayoutProps;
  title: string;
  sideBar: any;
  children: any;
}) {
  console.log(props.children)
  // console.log(props.sideBar)
  // console.log(props.option);
  // console.log("css", props.option.customCss);
  // console.log("html", props.option.customHtml);
  // console.log("script", decode(props.option.customScript as string));
  const [isOpen, setIsOpen] = useState(false);
  const { current } = useRef({ hasInit: false });
  const [theme, setTheme] = useState<RealThemeType>(getTheme("auto"));
  const handleClose = () => {
    console.log("关闭或刷新页面");
    localStorage.removeItem("saidHello");
  };
  useEffect(() => {
    if (!current.hasInit && !localStorage.getItem("saidHello")) {
      current.hasInit = true;
      localStorage.setItem("saidHello", "true");
      console.log("这是layout的useEffect输出")
      window.onbeforeunload = handleClose;
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props]);
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href={props.option.favicon}></link>
        <meta name="description" content={props.option.description}></meta>
        <meta name="robots" content="index, follow"></meta>
      </Head>
      {/* 返回顶部按钮 */}
      <BackToTopBtn></BackToTopBtn>
      {props.option.baiduAnalysisID != "" &&
        process.env.NODE_ENV != "development" && (
          <BaiduAnalysis id={props.option.baiduAnalysisID}></BaiduAnalysis>
        )}

      {props.option.gaAnalysisID != "" &&
        process.env.NODE_ENV != "development" && (
          <GaAnalysis id={props.option.gaAnalysisID}></GaAnalysis>
        )}
      <ThemeContext.Provider
        value={{
          setTheme,
          theme,
        }}
      >
        <Toaster />
        {/* <ImageProvider> */}
        {/* 上方的导航栏 */}
          <NavBar
            openArticleLinksInNewWindow={
              props.option.openArticleLinksInNewWindow == "true"
            }
            showRSS={props.option.showRSS}
            defaultTheme={props.option.defaultTheme}
            showSubMenu={props.option.showSubMenu}
            headerLeftContent={props.option.headerLeftContent}
            subMenuOffset={props.option.subMenuOffset}
            showAdminButton={props.option.showAdminButton}
            menus={props.option.menus}
            siteName={props.option.siteName}
            logo={props.option.logo}
            categories={props.option.categories}
            isOpen={isOpen}
            setOpen={setIsOpen}
            logoDark={props.option.logoDark}
            showFriends={props.option.showFriends}
          ></NavBar>
          {/* 下面的好像是移动端的？ */}
          <NavBarMobile
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showAdminButton={props.option.showAdminButton}
            showFriends={props.option.showFriends}
            menus={props.option.menus}
          />

            {/* 下面的界面 */}
          <div className=" mx-auto  lg:px-6  md:py-4 py-2 px-2 md:px-4  text-grey-700 ">
            <LayoutBody children={props.children} sideBar={props.sideBar} />
            {/* 下方的标签 本站运行了****** Powered By******* 等等*/}
            <Footer
              ipcHref={props.option.ipcHref}
              ipcNumber={props.option.ipcNumber}
              since={props.option.since}
              version={props.option.version}
              gaBeianLogoUrl={props.option.gaBeianLogoUrl}
              gaBeianNumber={props.option.gaBeianNumber}
              gaBeianUrl={props.option.gaBeianUrl}
            />
          </div>
        {/* </ImageProvider> */}
      </ThemeContext.Provider>
      {props.option.enableCustomizing == "true" && (
        <CustomLayout
          customCss={props.option.customCss}
          customHtml={props.option.customHtml}
          customScript={props.option.customScript}
          customHead={props.option.customHead}
        />
      )}
    </>
  );
}
