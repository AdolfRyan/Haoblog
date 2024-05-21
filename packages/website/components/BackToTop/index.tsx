import throttle from "lodash/throttle";
import React, { useEffect, useState } from "react";

import style from "../../styles/back-to-top.module.css";
import { scrollTo } from "../../utils/scroll";

//获取页面的滚动距离
const getScrollTop = (): number =>
  window.pageYOffset ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;
//滚动到页面顶部
const scrollToTop = () =>
  scrollTo(window, {
    top: 0,
    easing: "ease-in-out",
    duration: 800,
  });

export default () => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const onScroll = throttle((event: any) => {
      event.stopPropagation();
      event.preventDefault();

      setDisplay(getScrollTop() > 300);
    }, 500);

    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  }, [display]);

  return (
    <>
    {/* display: flex;：设置为 flex 布局，元素的子元素会排成一行。
justify-content: center; 和 align-items: center;：设置 flex 布局的对齐方式为居中，元素的子元素会在主轴和交叉轴上居中。
position: fixed;：设置定位方式为固定定位，元素的位置相对于浏览器窗口固定。
right: 1rem; 和 bottom: 2rem;：设置元素距离右边和底部的距离。
width: 42px; 和 height: 42px;：设置元素的宽度和高度。
background-color: #fff;：设置背景颜色为白色。
font-size: 40px;：设置字体大小为 40px。
z-index: 90;：设置堆叠顺序为 90，元素会覆盖 z-index 值小于 90 的元素。
cursor: pointer;：设置鼠标指针为手形，表示元素是可点击的。
text-align: center;：设置文本对齐方式为居中。
box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.15);：设置阴影效果。 */}
      {display && (
        <div
          title="返回顶部"
          className={`${style.backToTop} dark:nav-shadow-dark text-gray-600 rounded-xl transform  transition-all  dark:bg-dark hover:scale-110 fill-dark dark:text-dark`}
          onClick={scrollToTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M512 843.2c-36.2 0-66.4-13.6-85.8-21.8-10.8-4.6-22.6 3.6-21.8 15.2l7 102c.4 6.2 7.6 9.4 12.6 5.6l29-22c3.6-2.8 9-1.8 11.4 2l41 64.2c3 4.8 10.2 4.8 13.2 0l41-64.2c2.4-3.8 7.8-4.8 11.4-2l29 22c5 3.8 12.2.6 12.6-5.6l7-102c.8-11.6-11-20-21.8-15.2-19.6 8.2-49.6 21.8-85.8 21.8z" />
            <path d="m795.4 586.2-96-98.2C699.4 172 513 32 513 32S324.8 172 324.8 488l-96 98.2c-3.6 3.6-5.2 9-4.4 14.2L261.2 824c1.8 11.4 14.2 17 23.6 10.8L419 744s41.4 40 94.2 40c52.8 0 92.2-40 92.2-40l134.2 90.8c9.2 6.2 21.6.6 23.6-10.8l37-223.8c.4-5.2-1.2-10.4-4.8-14zM513 384c-34 0-61.4-28.6-61.4-64s27.6-64 61.4-64c34 0 61.4 28.6 61.4 64S547 384 513 384z" />
          </svg>
        </div>
      )}
    </>
  );
};
