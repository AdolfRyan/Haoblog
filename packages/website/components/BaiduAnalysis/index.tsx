//加载并执行百度统计的脚本，用于收集和分析网站访问数据。
import Script from "next/script";
import { useEffect, useRef } from "react";
export default function (props: { id: string }) {
  const { current } = useRef<any>({ hasInit: false });
  useEffect(() => {
    if (!current.hasInit && props.id != "") {
      current.hasInit = true;
      var _hmt: any = _hmt || [];
    }
  }, [current, props]);
  return (
    <>
      {props.id != "" && (
        <Script src={`https://hm.baidu.com/hm.js?${props.id}`} async></Script>
      )}
    </>
  );
}
