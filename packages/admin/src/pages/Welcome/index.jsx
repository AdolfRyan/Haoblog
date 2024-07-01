import { useTab } from '@/services/Haoblog/haoblog/useTab';
import { PageContainer } from '@ant-design/pro-layout';
import style from './index.less';
import Article from './tabs/article';
import OverView from './tabs/overview';
import Viewer from './tabs/viewer';
const Welcome = () => {
  const [tab, setTab] = useTab('overview', 'tab');

  const tabMap = {
    overview: <OverView />,
    viewer: <Viewer />,
    article: <Article />,
  };

  return (
    <PageContainer
      extra={null}
      header={{ title: null, extra: null, ghost: true }}
      className={style.thinheader}
      onTabChange={(k) => {
        setTab(k);
      }}
      tabActiveKey={tab}
      tabList={[
        {
          tab: '数据概览',
          key: 'overview',
        },
        {
          tab: '访客统计',
          key: 'viewer',
        },
        {
          tab: '文章分析',
          key: 'article',
        },
      ]}
      title={null}
    >
      {tabMap[tab]}
    </PageContainer>
  );
};

export default Welcome;
