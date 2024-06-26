import { createApiToken, getAllApiTokens, deleteApiToken } from '@/services/Haoblog/haoblog/api';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Card, message, Modal, Space, Typography } from 'antd';

import { useRef } from 'react';
import { history } from 'umi';
const columns = [
  { dataIndex: '_id', title: 'ID' },
  { dataIndex: 'name', title: '名称' },
  {
    dataIndex: 'token',
    title: '内容',
    render: (token) => {
      return (
        <Typography.Text style={{ maxWidth: 250 }} ellipsis={true} copyable={true}>
          {token}
        </Typography.Text>
      );
    },
  },
  {
    title: '操作',
    render: (text, record, _, action) => [
      <a
        key="delete"
        style={{ marginLeft: 8 }}
        onClick={() => {
          Modal.confirm({
            title: '删除确认',
            content: '是否确认删除该 Token？',
            onOk: async () => {
              await deleteApiToken(record._id);
              action?.reload();
              message.success('删除成功！');
            },
          });
        }}
      >
        删除
      </a>,
    ],
  },
];
export default function () {
  const actionRef = useRef();
  return (
    <>
      <Card
        title="Token 管理"
        style={{ marginTop: 8 }}
        className="card-body-full"
        extra={
          <Space>
            <ModalForm
              title="新建 API Token"
              trigger={<Button type="primary"> 新建</Button>}
              onFinish={async (vals) => {
                await createApiToken(vals);
                actionRef.current?.reload();
                return true;
              }}
            >
              <ProFormText label="名称" name="name" />
            </ModalForm>
            <Button
              onClick={() => {
                window.open('/swagger', '_blank');
              }}
            >
              API 文档
            </Button>
            <Button
              onClick={() => {
                Modal.info({
                  title: 'Token 管理功能介绍',
                  content: (
                    <div>

                    </div>
                  ),
                });
              }}
            >
              帮助
            </Button>
          </Space>
        }
      >
        <ProTable
          rowKey="id"
          columns={columns}
          dateFormatter="string"
          actionRef={actionRef}
          search={false}
          options={false}
          pagination={{
            hideOnSinglePage: true,
            simple: true,
          }}
          request={async (params = {}) => {
            let { data } = await getAllApiTokens();
            return {
              data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: data.length,
            };
          }}
        />
      </Card>
    </>
  );
}
