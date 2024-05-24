import CodeEditor from '@/components/CodeEditor'; // 引入代码编辑器组件
import UploadBtn from '@/components/UploadBtn'; // 引入上传按钮组件
import {
  getCustomPageByPath,
  getCustomPageFileDataByPath,
  getCustomPageFolderTreeByPath,
  updateCustomPage,
  updateCustomPageFileInFolder,
  getPipelineById,
  updatePipelineById,
  getPipelineConfig,
} from '@/services/van-blog/api'; // 引入API服务
import { DownOutlined } from '@ant-design/icons'; // 引入图标
import { PageContainer } from '@ant-design/pro-layout'; // 引入页面容器组件
import { Button, Dropdown, Menu, message, Modal, Space, Spin, Tag, Tree } from 'antd'; // 引入Ant Design组件
import { useCallback, useEffect, useMemo, useState } from 'react'; // 引入React钩子
import { history } from 'umi'; // 引入UmiJS的历史对象，用于路由跳转
import PipelineModal from '../Pipeline/components/PipelineModal'; // 引入流水线模态框组件
import RunCodeModal from '../Pipeline/components/RunCodeModal'; // 引入运行代码模态框组件
import './index.less'; // 引入样式文件
const { DirectoryTree } = Tree; // 解构Tree组件中的DirectoryTree

export default function () {
  // 定义状态变量
  const [value, setValue] = useState(''); // 编辑器内容
  const [currObj, setCurrObj] = useState<any>({}); // 当前对象
  const [node, setNode] = useState(); // 当前选中的树节点
  const [selectedKeys, setSelectedKeys] = useState([]); // 当前选中的树节点的key
  const [pipelineConfig, setPipelineConfig] = useState<any[]>([]); // 流水线配置
  const [pathPrefix, setPathPrefix] = useState(''); // 路径前缀
  const [treeData, setTreeData] = useState([{ title: 'door', key: '123' }]); // 树数据
  const [uploadLoading, setUploadLoading] = useState(false); // 上传加载状态
  const [editorLoading, setEditorLoading] = useState(false); // 编辑器加载状态
  const [treeLoading, setTreeLoading] = useState(true); // 树加载状态
  const [editorWidth, setEditorWidth] = useState(400); // 编辑器宽度
  const [editorHeight, setEditorHeight] = useState('calc(100vh - 82px)'); // 编辑器高度
  const type = history.location.query?.type; // 路由查询参数中的类型
  const path = history.location.query?.path; // 路由查询参数中的路径
  const id = history.location.query?.id; // 路由查询参数中的ID
  const isFolder = type == 'folder'; // 是否为文件夹类型
  const typeMap = {
    file: '单文件页面', // 单文件页面
    folder: '多文件页面', // 多文件页面
    pipeline: '流水线', // 流水线
  };

  // 获取流水线配置
  useEffect(() => {
    getPipelineConfig().then(({ data }) => {
      setPipelineConfig(data);
    });
  }, []);

  // 根据文件类型确定编辑器语言
  const language = useMemo(() => {
    if (type == 'pipeline') {
      return 'javascript';
    }
    if (!node) {
      return 'html';
    }
    const name = node.title;
    if (!name) {
      return 'html';
    }
    const cssArr = ['css', 'less', 'scss'];
    const tsArr = ['ts', 'tsx'];
    const htmlArr = ['html', 'htm'];
    const jsArr = ['js', 'jsx'];
    const m = {
      javascript: jsArr,
      typescript: tsArr,
      html: htmlArr,
      css: cssArr,
    };
    for (const [k, v] of Object.entries(m)) {
      if (v.some((t) => name.includes('.' + t))) {
        return k;
      }
    }
    return 'html';
  }, [node]);

  // 更新编辑器尺寸
  const onResize = () => {
    updateEditorSize();
  };

  // 处理菜单按钮点击事件，更新编辑器尺寸
  const onClickMenuChangeBtn = () => {
    setTimeout(() => {
      updateEditorSize();
    }, 500);
  };

  // 添加窗口大小变化监听器
  useEffect(() => {
    window.addEventListener('resize', onResize);
    const menuBtnEl = document.querySelector('.ant-pro-sider-collapsed-button');
    if (menuBtnEl) {
      menuBtnEl.addEventListener('click', onClickMenuChangeBtn);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      if (menuBtnEl) {
        menuBtnEl.removeEventListener('click', onClickMenuChangeBtn);
      }
    };
  }, []);

  // 更新编辑器尺寸
  const updateEditorSize = () => {
    const el = document.querySelector('.ant-page-header');
    const fullWidthString = window.getComputedStyle(el).width;
    const fullWidth = parseInt(fullWidthString.replace('px', ''));
    const width = isFolder ? fullWidth - 1 - 200 : fullWidth;
    setEditorWidth(width);
    const HeaderHeightString = window.getComputedStyle(el).height;
    const HeaderHeight = parseInt(HeaderHeightString.replace('px', ''));
    setEditorHeight(`calc(100vh - ${HeaderHeight + 12}px)`);
  };

  // 处理按键事件，保存文件
  const onKeyDown = (ev) => {
    let save = false;
    if (ev.metaKey == true && ev.key.toLocaleLowerCase() == 's') {
      save = true;
    }
    if (ev.ctrlKey == true && ev.key.toLocaleLowerCase() == 's') {
      save = true;
    }
    if (save) {
      event?.preventDefault();
      ev?.preventDefault();
      handleSave();
    }
    return false;
  };

  // 添加键盘事件监听器
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [currObj, value, type]);

  // 更新编辑器尺寸
  useEffect(() => {
    setTimeout(() => {
      updateEditorSize();
    }, 300);
  }, []);

  // 处理文件上传
  const handleUpload = async () => {
    // 文件上传逻辑
  };

  // 获取文件数据
  const fetchFileData = async (node: any) => {
    setEditorLoading(true);
    const { data } = await getCustomPageFileDataByPath(path, node.key);
    setValue(data);
    setEditorLoading(false);
  };

  // 获取页面或文件夹数据
  const fetchData = useCallback(async () => {
    if (!path && !id) {
      message.error('无有效信息，无法获取数据！');
      return;
    } else {
      if (isFolder) {
        setTreeLoading(true);
        setCurrObj({ name: path });
        const { data } = await getCustomPageFolderTreeByPath(path);
        if (data) setTreeData(data);
        setTreeLoading(false);
      } else if (type == 'pipeline') {
        if (!id) {
          message.error('无有效信息，无法获取数据！');
          return;
        }
        setEditorLoading(true);
        const { data } = await getPipelineById(id);
        if (data) {
          setCurrObj(data);
          setValue(data?.script || '');
        }
        setEditorLoading(false);
      } else {
        setEditorLoading(true);
        const { data } = await getCustomPageByPath(path);
        if (data) {
          setCurrObj(data);
          setValue(data?.html || '');
        }
        setEditorLoading(false);
      }
    }
  }, [setCurrObj, setValue, path]);

  // 保存当前编辑器内容
  const handleSave = async () => {
    if (location.hostname == 'blog-demo.mereith.com') {
      Modal.info({
        title: '演示站不可修改此项！',
      });
      return;
    }
    if (type == 'file') {
      setEditorLoading(true);
      await updateCustomPage({ ...currObj, html: value });
      setEditorLoading(false);
      message.success('当前编辑器内文件保存成功！');
    } else if (type == 'pipeline') {
      setEditorLoading(true);
      await updatePipelineById(currObj.id, { script: value });
      setEditorLoading(false);
      message.success('当前编辑器内脚本保存成功！');
    } else {
      setEditorLoading(true);
      await updateCustomPageFileInFolder(path, node?.key, value);
      setEditorLoading(false);
      message.success('当前编辑器内文件保存成功！');
    }
  };

  // 操作菜单配置
  const actionMenu = (
    <Menu
      items={[
        {
          key: 'saveBtn',
          label: '保存',
          onClick: handleSave,
        },
        ...(type == 'pipeline'
          ? [
              {
                key: 'runPipeline',
                label: <RunCodeModal pipeline={currObj} trigger={<a>调试脚本</a>} />,
              },
              {
                key: 'editPipelineInfo',
                label: (
                  <PipelineModal
                    mode="edit"
                    trigger={<a>编辑信息</a>}
                    onFinish={(vals) => {
                      console.log(vals);
                    }}
                    initialValues={currObj}
                  />
                ),
              },
            ]
          : []),
        ...(isFolder
          ? [
              {
                key: 'uploadFile',
                label: (
                  <UploadBtn
                    setLoading={setUploadLoading}
                    folder={true}
                    muti={true}
                    customUpload={true}
                    text="上传文件夹"
                    onFinish={(info) => {
                      fetchData();
                    }}
                    url={`/api/admin/customPage/upload?path=${path}`}
                    accept="*"
                    loading={uploadLoading}
                    plainText={true}
                  />
                ),
              },
              {
                key: 'uploadFolder',
                label: (
                  <UploadBtn
                    basePath={pathPrefix}
                    customUpload={true}
                    plainText={true}
                    setLoading={setUploadLoading}
                    folder={false}
                    muti={false}
                    text="上传文件"
                    onFinish={(info) => {
                      fetchData();
                    }}
                    url={`/api/admin/customPage/upload?path=${path}`}
                    accept="*"
                    loading={uploadLoading}
                  />
                ),
              },
            ]
          : []),
        ...(type == 'file'
          ? [
              {
                key: 'view',
                label: '查看',
                onClick: () => {
                  window.open(`/c${path}`);
                },
              },
            ]
          : []),
      ]}
    />
  );

  // 获取数据并更新状态
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 渲染页面容器和编辑器内容
  return (
    <PageContainer
      className="editor-full"
      header={{
        title: (
          <Space>
            <span title={currObj?.name}>{currObj?.name}</span>
            <>
              <Tag color="green">{typeMap[type] || '未知类型'}</Tag>
              {type == 'pipeline' && (
                <>
                  <Tag color="blue">
                    {
                      pipelineConfig?.find((p) => p.eventName == currObj.eventName)
                        ?.eventNameChinese
                    }
                  </Tag>
                  {pipelineConfig?.find((p) => p.eventName == currObj.eventName)?.passive ? (
                    <Tag color="yellow">非阻塞</Tag>
                  ) : (
                    <Tag color="red">阻塞</Tag>
                  )}
                </>
              )}
            </>
          </Space>
        ),
        extra: [
          <Dropdown key="moreAction" overlay={actionMenu} trigger={['click']}>
            <Button size="middle" type="primary">
              操作
              <DownOutlined />
            </Button>
          </Dropdown>,
          <Button
            key="backBtn"
            onClick={() => {
              history.go(-1);
            }}
          >
            返回
          </Button>,
          <Button
            key="docBtn"
            onClick={() => {
              if (type == 'pipeline') {
                window.open('https://vanblog.mereith.com/features/pipeline.html', '_blank');
              } else {
                window.open(
                  'https://vanblog.mereith.com/feature/advance/customPage.html',
                  '_blank',
                );
              }
            }}
          >
            文档
          </Button>,
        ],
        breadcrumb: {},
      }}
      footer={null}
    >
      <div style={{ height: '100%', display: 'flex' }} className="code-editor-content">
        {isFolder && (
          <>
            <Spin spinning={treeLoading}>
              <div
                className="file-tree-container"
                onClick={(ev) => {
                  const container = document.querySelector('.file-tree-container')!;
                  const tree = document.querySelector('.ant-tree-list')!;
                  if (ev.target == container || ev.target == tree) {
                    setSelectedKeys([]);
                    setPathPrefix('');
                  }
                }}
                style={{
                  width: '200px',
                  background: 'white',
                }}
              >
                {/* <div className="toolbar">
                  <div className="left"> {path}</div>
                  <div className="right">
                    <div
                      className="action-icon"
                      onClick={async () => {
                        setTreeLoading(true);
                        await createCustomFile(path, pathPrefix);
                        setTreeLoading(false);
                        fetchData();
                      }}
                    >
                      <Tooltip title="新建文件">
                        <FileAddOutlined />
                      </Tooltip>
                    </div>
                    <div
                      className="action-icon"
                      onClick={async () => {
                        setTreeLoading(true);
                        await createCustomFolder(path, pathPrefix);
                        setTreeLoading(false);
                        fetchData();
                      }}
                    >
                      <Tooltip title="新建文件夹">
                        <FolderAddOutlined />
                      </Tooltip>
                    </div>
                  </div>
                </div> */}
                <DirectoryTree
                  style={{ height: editorHeight }}
                  className="file-tree"
                  defaultExpandAll
                  selectedKeys={selectedKeys}
                  // onRightClick={({ event, node }) => {
                  //   console.log(event);
                  // }}
                  onSelect={(keys, info) => {
                    if (editorLoading) {
                      message.warning('加载中请勿选择!');
                      return;
                    }
                    setSelectedKeys(keys);
                    const node = info.node as any;
                    if (node.type == 'file') {
                      fetchFileData(node);
                      setNode(node);
                      const arr = node.key.split('/');
                      arr.pop();
                      setPathPrefix(arr.join('/'));
                    } else {
                      setPathPrefix(node.key);
                    }
                  }}
                  treeData={treeData}
                />
              </div>
            </Spin>
            <div className="divider-v"></div>
          </>
        )}
        <Spin spinning={editorLoading}>
          <CodeEditor
            value={value}
            onChange={setValue}
            language={language}
            width={editorWidth}
            height={editorHeight}
          />
        </Spin>
      </div>
    </PageContainer>
  );
}
