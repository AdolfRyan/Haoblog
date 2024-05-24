import ImportArticleModal from '@/components/ImportArticleModal';
import NewArticleModal from '@/components/NewArticleModal';
import { getArticlesByOption } from '@/services/van-blog/api';
import { batchExport, batchDelete } from '@/services/van-blog/batch';
import { useNum } from '@/services/van-blog/useNum';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useMemo, useRef, useState } from 'react';
import { history } from 'umi';
import { articleObjAll, articleObjSmall, columns } from './columns';

// 定义默认导出的函数式组件
export default () => {
  // 引用操作表格的 Ref
  const actionRef = useRef();

  // 定义状态变量
  const [colKeys, setColKeys] = useState(articleObjAll);  // 列显示配置
  const [simplePage, setSimplePage] = useState(false);  // 简化分页
  const [simpleSearch, setSimpleSearch] = useState(false);  // 简化搜索
  const [pageSize, setPageSize] = useNum(10, 'article-page-size');  // 每页显示的文章数量

  // 根据 simpleSearch 的状态计算搜索栏的跨度
  const searchSpan = useMemo(() => {
    if (!simpleSearch) {
      return 8;
    } else {
      return 24;
    }
  }, [simpleSearch]);

  return (
    <PageContainer
      title={null}
      extra={null}
      ghost
      className="t-8"
      header={{ title: null, extra: null, ghost: true }}
    >
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          const r = offset.width < 1000;

          setSimpleSearch(offset.width < 750);
          setSimplePage(offset.width < 600);
          if (r) {
            setColKeys(articleObjSmall);  // 屏幕宽度小于1000时使用精简列配置
          } else {
            setColKeys(articleObjAll);  // 否则使用完整列配置
          }
        }}
      >
        <ProTable
          columns={columns}  // 表格列配置
          actionRef={actionRef}  // 操作表格的 Ref
          cardBordered
          rowSelection={{
            fixed: true,
            preserveSelectedRowKeys: true,
          }}
          tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
            return (
              <Space>
                <a
                  onClick={async () => {
                    await batchDelete(selectedRowKeys);  // 批量删除选中的文章
                    message.success('批量删除成功！');
                    actionRef.current.reload();  // 刷新表格数据
                    onCleanSelected();  // 清除选择
                  }}
                >
                  批量删除
                </a>
                <a
                  onClick={() => {
                    batchExport(selectedRowKeys);  // 批量导出选中的文章
                    onCleanSelected();  // 清除选择
                  }}
                >
                  批量导出
                </a>
                <a onClick={onCleanSelected}>取消选择</a>
              </Space>
            );
          }}
          request={async (params = {}, sort, filter) => {
            // 构建请求参数
            const option = {};
            if (sort.createdAt) {
              option.sortCreatedAt = sort.createdAt === 'ascend' ? 'asc' : 'desc';
            }
            if (sort.top) {
              option.sortTop = sort.top === 'ascend' ? 'asc' : 'desc';
            }
            if (sort.viewer) {
              option.sortViewer = sort.viewer === 'ascend' ? 'asc' : 'desc';
            }

            const { current, pageSize, ...searchObj } = params;
            if (searchObj) {
              for (const [targetName, target] of Object.entries(searchObj)) {
                switch (targetName) {
                  case 'title':
                    if (target.trim() != '') {
                      option.title = target;
                    }
                    break;
                  case 'tags':
                    if (target.trim() != '') {
                      option.tags = target;
                    }
                    break;
                  case 'endTime':
                    if (searchObj?.startTime) {
                      option.startTime = searchObj?.startTime;
                    }
                    if (searchObj?.endTime) {
                      option.endTime = searchObj?.endTime;
                    }
                    break;
                  case 'category':
                    if (target.trim() != '') {
                      option.category = target;
                    }
                    break;
                }
              }
            }
            option.page = current;
            option.pageSize = pageSize;

            // 发送请求获取文章数据
            const { data } = await getArticlesByOption(option);
            const { articles, total } = data;
            return {
              data: articles,
              success: Boolean(data),
              total: total,
            };
          }}
          editable={false}
          columnsState={{
            value: colKeys,
            onChange(value) {
              setColKeys(value);  // 更新列显示配置
            },
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            span: searchSpan,
            className: 'searchCard',
          }}
          pagination={{
            pageSize: pageSize,
            simple: simplePage,
            onChange: (p, ps) => {
              if (ps != pageSize) {
                setPageSize(ps);  // 更新每页显示数量
              }
            },
          }}
          dateFormatter="string"
          headerTitle={simpleSearch ? undefined : '文章管理'}
          options={simpleSearch ? false : true}
          toolBarRender={() => [
            <Button
              key="editAboutMe"
              onClick={() => {
                history.push(`/editor?type=about&id=${0}`);  // 跳转到编辑关于页面
              }}
            >
              {`编辑关于`}
            </Button>,
            <NewArticleModal
              key="newArticle123"
              onFinish={(data) => {
                actionRef?.current?.reload();  // 刷新表格数据
                history.push(`/editor?type=article&id=${data.id}`);  // 跳转到编辑文章页面
              }}
            />,
            <ImportArticleModal
              key="importArticleBtn"
              onFinish={() => {
                actionRef?.current?.reload();  // 刷新表格数据
                message.success('导入成功！');
              }}
            />,
          ]}
        />
      </RcResizeObserver>
    </PageContainer>
  );
};
