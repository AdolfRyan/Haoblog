import { calItemList, PageNavProps } from "./core";
import { RenderItemList } from "./render";
//根据 props 中的 total 和 pageSize 属性来决定是否显示一个项目列表。如果 total 大于 pageSize，则显示项目列表，否则不显示。
export default function (props: PageNavProps) {
  const pageSize = props?.pageSize || 5;
  const show = props.total > pageSize;
  return show ? (
    <div className="mt-4">
      <div>
        <RenderItemList items={calItemList(props)}></RenderItemList>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
