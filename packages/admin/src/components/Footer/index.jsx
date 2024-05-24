import { useEffect, useRef } from 'react';
import { history, useModel } from 'umi';
import './index.css';
const Footer = () => {
  const { initialState } = useModel('@@initialState');
  const { current } = useRef({ hasInit: false });
  // const version = useMemo(() => {
  //   let v = initialState?.version || '获取中...';
  //   if (history.location.pathname == '/user/login') {
  //     v = '登录后显示';
  //   }
  //   return v;
  // }, [initialState, history]);
  useEffect(() => {
    if (!current.hasInit) {
      current.hasInit = true;
      let v = initialState?.version || '获取中...';
      if (history.location.pathname == '/user/login') {
        v = '登录后显示';
      }
      console.log('🚀欢迎使用 HaoBlog 博客系统');
      console.log('当前版本：', v);
    }
  }, [initialState, history]);
  return null;
};

export default Footer;
