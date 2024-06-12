//快捷键显示
import { useEffect, useState } from "react";
import { isMac } from "../../utils/ua";
// flex：这个类使元素成为一个 flex 容器，这样其子元素就可以使用 flex 布局。
// items-center：这个类使 flex 容器的子元素在交叉轴（默认为垂直轴）上居中对齐。
// hidden：这个类使元素在默认情况下隐藏。
// sm:flex：这个类使元素在小屏幕（sm）尺寸及以上时成为一个 flex 容器。这与 flex 类相结合，实现了一个响应式设计：在小屏幕尺寸及以上时显示元素，否则隐藏元素。
// text-gray-500：这个类设置元素的文本颜色为灰色，亮度为 500（Tailwind 的颜色系统中，数字越大，颜色越深）。
// text-sm：这个类设置元素的文本大小为小号。
// leading-5：这个类设置元素的行高为 1.25rem。
// py-0.5：这个类设置元素的垂直（上下）内边距为 0.125rem。
// px-1.5：这个类设置元素的水平（左右）内边距为 0.375rem。
// border：这个类给元素添加一个边框。
// border-gray-300：这个类设置元素边框的颜色为灰色，亮度为 300。
// rounded-md：这个类给元素添加一个中等大小的圆角。
// dark:text-dark：这个类在 dark 模式下设置元素的文本颜色为 dark。
// dark:border-dark：这个类在 dark 模式下设置元素边框的颜色为 dark。
// font-sans：这个类设置元素的字体为无衬线字体。
// no-underline：这个类移除元素的下划线。
// mx-1：这个类设置元素的水平（左右）外边距为 0.25rem。
// sr-only：这个类隐藏元素，但对屏幕阅读器仍然可见。这对于提高网站的无障碍访问性非常有用。
export default function (props: { type: "search" | "esc" }) {
  const [keyString, setKeyString] = useState("Ctrl");
  useEffect(() => {
    if (isMac()) {
      setKeyString("⌘");
    }
  }, [])
  if (props.type == "search") {
    return (
      <div className="flex items-center">
        <span
          style={{ opacity: 1, height: 24 }}
          className="hidden sm:flex items-center  text-gray-500 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md dark:text-dark dark:border-dark"
        >
          <span className="sr-only">Press </span>
          <kbd className="font-sans ">
            <abbr className="no-underline ">{keyString}</abbr>
          </kbd>
          <span className="mx-1">+</span>
          <span className="sr-only"> and </span>
          <kbd className="font-sans ">K</kbd>
          <span className="sr-only"> to search</span>
        </span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center select-none ml-2">
        <span
          style={{ opacity: 1, height: 24, lineHeight: "17.73px" }}
          className="hidden sm:block text-gray-500 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md dark:text-dark dark:border-dark"
        >
          <span className="sr-only">Press </span>
          <kbd className="font-sans">esc</kbd>
          <span className="sr-only"> to close</span>
        </span>
      </div>
    );
  }
}
