export default function (props: {
  children: any;
  sideBar: any;
}) {
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
