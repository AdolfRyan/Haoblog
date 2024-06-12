import axios from 'axios';

export const getVersionFromServer = async () => {
  // 直接返回固定的数据
  const data = {
    version: "v0.54.0",
    updatedAt: "2023-06-27T08:32:28.246Z"
  };

  return data;
};
