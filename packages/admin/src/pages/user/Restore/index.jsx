import { restore } from '@/services/Haoblog/haoblog/api';
import { encryptPwd } from '@/services/Haoblog/haoblog/encryptPwd';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Alert, message } from 'antd';
import { history } from 'umi';
export default function () {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        backgroundImage: `url('/background.svg')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
      }}
    >
      <ProCard
        title="忘记密码"
        bordered
        style={{ maxWidth: '700px', marginTop: '200px', maxHeight: '470px' }}
      >
        <Alert
          type="info"
          style={{ marginBottom: 12 }}
          message={
            <p style={{ marginBottom: 0 }}>

            </p>
          }
        ></Alert>
        <ProForm
          onFinish={async (values) => {
            await restore({
              ...values,
              password: encryptPwd(values.name, values.password),
            });
            message.success('重置成功！恢复密钥将重新生成！');
            history.push('/user/login');
          }}
        >
          <ProFormText.Password name="key" label="请输入恢复密钥" />
          <ProFormText name="name" label="请输入新用户名" />
          <ProFormText.Password name="password" label="请输入新密码" />
        </ProForm>
      </ProCard>
    </div>
  );
}
