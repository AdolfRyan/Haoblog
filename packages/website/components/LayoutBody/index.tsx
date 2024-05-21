export default function (props: {
  children: any;
  sideBar: any;
}) {
//   flex：设置为 flex 布局，元素会排成一行。
// mx-auto：设置左右（水平方向）的 margin 为 auto，通常用于水平居中。
// justify-center：设置 flex 布局的主轴对齐方式为居中，元素会在主轴方向上居中。

// flex-shrink：设置 flex 缩小因子为 1，当空间不足时，元素可以缩小。
// flex-grow：设置 flex 增大因子为 1，当有多余空间时，元素可以增大。
// md:max-w-3xl：在中等（md）屏幕尺寸以上，设置最大宽度为 3xl。
// xl:max-w-4xl：在超大（xl）屏幕尺寸以上，设置最大宽度为 4xl。
// w-full：设置宽度为 100%。
// vanblog-main：这是一个自定义的类名，可能是设置了一些特定的样式。
// hidden：设置元素为隐藏，元素不会显示在页面上。
// lg:block：在大（lg）屏幕尺寸以上，设置元素为块级元素，元素会独占一行。
// flex-shrink-0：设置 flex 缩小因子为 0，当空间不足时，元素不会缩小。
// flex-grow-0：设置 flex 增大因子为 0，当有多余空间时，元素不会增大。
// vanblog-sider：这是一个自定义的类名，可能是设置了一些特定的样式。
// w-52：设置宽度为 13rem。
  return (
    <>
      <div className="flex mx-auto justify-center">
        {/* 页面下的小窗口 */}
        <div className="flex-shrink flex-grow md:max-w-3xl xl:max-w-4xl w-full vanblog-main">
          {props.children}
        </div>
        {/* 不知道干啥的 */}
        <div
          className={`hidden lg:block flex-shrink-0 flex-grow-0 vanblog-sider ${
            Boolean(props.sideBar) ? "w-52" : ""
          }`}
        >
          {props.sideBar}
        </div>
      </div>
    </>
  );
}
