import NbRequest from "./index";
import { addMock }from './mock/index'
interface BaseResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
const ehudongUrl = import.meta.env.VITE_E_URL as string;
const dhudongUrl = import.meta.env.VITE_D_URL as string;
const snsUrl = import.meta.env.VITE_API_URL as string; // 后台域名

const APIPath = {
  getInfo: `${snsUrl}act-gateway/act-core/act/1/parkour/index`, // 获取首页信息
  completeGuide: `${snsUrl}act-gateway/act-core/act/1/parkour/completeGuide`, // 完成新手引导
};


addMock(APIPath);

export const getInfo = <T = any>(): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.getInfo, { },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};


export const completeGuide = <T = any>(): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.completeGuide, { },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};
