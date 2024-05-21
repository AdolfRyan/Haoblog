import AuthorCard, { AuthorCardProps } from "../components/AuthorCard";
import Layout from "../components/Layout";
import TimeLineItem from "../components/TimeLineItem";
import { Article } from "../types/article";
import { LayoutProps } from "../utils/getLayoutProps";
import { getTimeLinePageProps } from "../utils/getPageProps";
import { revalidate } from "../utils/loadConfig";
export interface TimeLinePageProps {
  layoutProps: LayoutProps;
  authorCardProps: AuthorCardProps;
  sortedArticles: Record<string, Article[]>;
  wordTotal: number;
}
// 这个文件的主要功能是显示一个时间线页面，页面上的每一项都是一个 TimeLineItem 组件，表示一篇文章

// bg-white：设置背景颜色为白色。
// card-shadow：这是一个自定义的类名，可能是设置了卡片的阴影效果。
// dark:bg-dark：在 dark 模式下，设置背景颜色为 dark。
// dark:card-shadow-dark：在 dark 模式下，设置卡片的阴影效果为 dark。
// py-4：设置垂直方向（上下）的 padding 为 1rem。
// px-8：设置水平方向（左右）的 padding 为 2rem。
// md:py-6：在中等（md）屏幕尺寸以上，设置垂直方向的 padding 为 1.5rem。
// md:px-8：在中等（md）屏幕尺寸以上，设置水平方向的 padding 为 2rem。
// text-2xl：设置文字大小为 2xl。
// md:text-3xl：在中等（md）屏幕尺寸以上，设置文字大小为 3xl。
// text-gray-700：设置文字颜色为灰色，亮度为 700。
// text-center：设置文字居中对齐。
// dark:text-dark：在 dark 模式下，设置文字颜色为 dark。
// text-sm：设置文字大小为 sm。
// mt-2：设置上边距（margin-top）为 0.5rem。
// mb-4：设置下边距（margin-bottom）为 1rem。
// font-light：设置字体粗细为 light。
// flex：设置为 flex 布局。
// flex-col：设置 flex 布局的方向为列（column）。
// mt-2：设置上边距（margin-top）为 0.5rem。
const TimeLine = (props: TimeLinePageProps) => {
  return (
    <Layout
      title={"时间线"}
      option={props.layoutProps}
      sideBar={<AuthorCard option={props.authorCardProps} />}
    >
      <div className="bg-white card-shadow dark:bg-dark dark:card-shadow-dark py-4 px-8 md:py-6 md:px-8">
        <div>
          {/* 标题 */}
          <div className="text-2xl md:text-3xl text-gray-700 text-center dark:text-dark">
            时间线
          </div>
          {/* 副标题 */}
          <div className="text-center text-gray-600 text-sm mt-2 mb-4 font-light dark:text-dark">{`${props.authorCardProps.catelogNum} 分类 × ${props.authorCardProps.postNum} 文章 × ${props.authorCardProps.tagNum} 标签 × ${props.wordTotal} 字`}</div>
        </div>
        <div className="flex flex-col mt-2">
          {Object.keys(props.sortedArticles)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((eachDate: string) => {
              return (
                <TimeLineItem
                  openArticleLinksInNewWindow={
                    props.layoutProps.openArticleLinksInNewWindow == "true"
                  }
                  defaultOpen={true}
                  key={`timeline-dateitem-${eachDate}`}
                  date={eachDate}
                  articles={props.sortedArticles[eachDate]}
                ></TimeLineItem>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default TimeLine;
export async function getStaticProps(): Promise<{
  props: TimeLinePageProps;
  revalidate?: number;
}> {
  return {
    props: await getTimeLinePageProps(),
    ...revalidate,
  };
}
