import NbRequest from "./index";
interface BaseResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}
const ehudongUrl = import.meta.env.VITE_E_URL as string;
const dhudongUrl = import.meta.env.VITE_D_URL as string;
const snsUrl = import.meta.env.VITE_API_URL as string; // 后台域名

const APIPath = {
  getInfo: `${snsUrl}api/v3/videos-activity/info`, // 获取页面信息
  getIndexInfo: `${snsUrl}api/v3/videos-activity/signList`, // 获取页面信息
  getHomeInfo: `${dhudongUrl}media/latest`, // 获取页面信息
  // https://dhudong.cztv.com/media/latest?category_id=107&channel_id=1&sort=0&size=10&page=1 
};

export const getInfo = <T = any>(activityId): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.getInfo, { activityId },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const getIndexInfo = <T = any>(param): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.getIndexInfo, param ,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};


export const getHomeInfo = <T = any>(param): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.getHomeInfo, param ,{},false,'json','json',30000,{baseURL:'/api'})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};
