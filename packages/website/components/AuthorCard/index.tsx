//zhuye 作者卡片
import Link from "next/link";
import { useContext, useEffect, useMemo } from "react";
import Headroom from "headroom.js";
import { SocialItem } from "../../api/getAllData";
import SocialCard from "../SocialCard";
import { ThemeContext } from "../../utils/themeContext";
import ImageBox from "../ImageBox";
export interface AuthorCardProps {
  author: string;
  desc: string;
  logo: string;
  logoDark: string;
  postNum: number;
  catelogNum: number;
  tagNum: number;
  enableComment?: "true" | "false";
  socials: SocialItem[];
  showSubMenu: "true" | "false";
  showRSS: "true" | "false";
}
// sticky：这个类使元素的定位方式为 sticky，也就是当页面滚动到一定位置时，元素会固定在屏幕上。
// w-52：这个类设置元素的宽度为 13rem。
// flex：这个类使元素成为一个 flex 容器，这样其子元素就可以使用 flex 布局。
// flex-col：这个类使 flex 容器的子元素沿着列方向排列。
// justify-center 和 items-center：这些类使 flex 容器的子元素在主轴和交叉轴上居中对齐。
// bg-white：这个类设置元素的背景颜色为白色。
// pt-6 和 pb-4：这些类分别设置元素的上内边距和下内边距。
// card-shadow：这个类可能是一个自定义类，用于给元素添加阴影效果。
// ml-2：这个类设置元素的左外边距。
// dark:bg-dark 和 dark:card-shadow-dark：这些类在 dark 模式下设置元素的背景颜色和阴影效果。
// px-10：这个类设置元素的左右内边距。
// rounded-full：这个类给元素添加最大的圆角，使其成为一个圆形。
// dark:filter-dark：这个类在 dark 模式下给元素添加一个滤镜效果。
// mt-2：这个类设置元素的上外边距。
// font-semibold：这个类设置元素的字体粗细为 semi-bold。
// text-gray-600：这个类设置元素的文本颜色为灰色，亮度为 600。
// mb-2：这个类设置元素的下外边距。
// text-sm：这个类设置元素的文本大小为小号。
// text-gray-500：这个类设置元素的文本颜色为灰色，亮度为 500。
// group：这个类用于创建一个 hover、focus、active 状态的分组，使得你可以在一个元素上触发状态改变时，影响其它元素的样式。
// px-1：这个类设置元素的左右内边距。
// group-hover:text-gray-900：这个类在元素的父元素（带有 group 类的元素）被 hover 时，设置元素的文本颜色为灰色，亮度为 900。
// font-bold：这个类设置元素的字体粗细为 bold。
// group-hover:font-black：这个类在元素的父元素（带有 group 类的元素）被 hover 时，设置元素的字体粗细为最粗。
// group-hover:font-normal：这个类在元素的父元素（带有 group 类的元素）被 hover 时，设置元素的字体粗细为 normal。
// mt-4：这个类设置元素的上外边距。
// w-full：这个类设置元素的宽度为 100%。
// justify-center：这个类使 flex 容器的子元素在主轴上居中对齐。
// px-2 和 py-1：这些类分别设置元素的左右内边距和上下内边距。
// select-none：这个类禁止用户选中元素的文本。
// cursor-pointer：这个类使元素的光标在 hover 时变为手形。
// hover:bg-gray-200：这个类在元素被 hover 时，设置元素的背景颜色为灰色，亮度为 200。
// rounded-sm：这个类给元素添加一个小的圆角。
// transition-all：这个类使元素的所有属性在改变时都有过渡效果。
// text-xs：这个类设置元素的文本大小为最小号。
export default function (props: { option: AuthorCardProps }) {
  const { theme } = useContext(ThemeContext);

  const logoUrl = useMemo(() => {
    if (
      theme.includes("dark") &&
      props.option.logoDark &&
      props.option.logoDark != ""
    ) {
      return props.option.logoDark;
    }
    return props.option.logo;
  }, [theme, props]);
  useEffect(() => {
    const el = document.querySelector("#author-card");
    if (el) {
      const headroom = new Headroom(el, {
        classes: {
          initial: `side-bar${props.option.showSubMenu == "true" ? "" : " no-submenu"
            }`,
          pinned: "side-bar-pinned",
          unpinned: "side-bar-unpinned",
          top: "side-bar-top",
          notTop: "side-bar-not-top",
        },
      });
      headroom.init();
    }
  });
  return (
    <div id="author-card" className="sticky ">
      <div className="w-52 flex flex-col justify-center items-center bg-white pt-6  pb-4 card-shadow ml-2 dark:bg-dark dark:card-shadow-dark">
        <div className="px-10 flex flex-col justify-center items-center">
          <ImageBox
            alt="author logo"
            className="rounded-full  dark:filter-dark"
            src={logoUrl}
            width={120}
            height={120}
            lazyLoad={false}
          />

          <div className="mt-2 font-semibold text-gray-600 mb-2 dark:text-dark">
            {props.option.author}
          </div>
          <div className="text-sm text-gray-500 mb-2 dark:text-dark-light">
            {props.option.desc}
          </div>
          <div className="flex">
            <Link href="/timeline">
              <div className="group flex flex-col justify-center items-center text-gray-600 text-sm px-1 dark:text-dark ">
                <div className="group-hover:text-gray-900 font-bold group-hover:font-black dark:group-hover:text-dark-hover">
                  {props.option.postNum}
                </div>
                <div className="group-hover:text-gray-900 group-hover:font-normal text-gray-500 dark:text-dark-light dark:group-hover:text-dark-hover">
                  日志
                </div>
              </div>
            </Link>
            <Link href="/category">
              <div className="group flex flex-col justify-center items-center text-gray-600 text-sm px-1 dark:text-dark">
                <div className="group-hover:text-gray-900 font-bold group-hover:font-black dark:group-hover:text-dark-hover">
                  {props.option.catelogNum}
                </div>
                <div className="group-hover:text-gray-900 group-hover:font-normal text-gray-500 dark:text-dark-light dark:group-hover:text-dark-hover">
                  分类
                </div>
              </div>
            </Link>
            <Link href="/tag">
              <div className="group flex flex-col justify-center items-center text-gray-600 text-sm px-1 dark:text-dark">
                <div className="group-hover:text-gray-900 font-bold group-hover:font-black dark:group-hover:text-dark-hover">
                  {props.option.tagNum}
                </div>
                <div className=" group-hover:text-gray-900 group-hover:font-normal text-gray-500 dark:text-dark-light dark:group-hover:text-dark-hover">
                  标签
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-4 w-full">
          <SocialCard socials={props.option.socials}></SocialCard>
        </div>
        {/* {props.option.showRSS == "true" && (
          <div className="mt-3 w-full flex justify-center">
            <a
              href={`/feed.xml`}
              rel="noreferrer"
              target="_blank"
              className="flex text-gray-500 px-2 py-1 dark:text-dark select-none cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-light dark:hover:text-dark-r rounded-sm transition-all text-xs"
            >
              <RssLogo size={18} />
              <span className="ml-1 text-sm">RSS</span>
            </a>
          </div>
        )} */}
      </div>
    </div>
  );
}
