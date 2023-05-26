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
  healthInfoIndex: `${snsUrl}act-gateway/act-core/act/1/parkour/index`, // 获取首页信息
  completeGuide: `${snsUrl}act-gateway/act-core/act/1/parkour/completeGuide`, // 完成新手引导
  gameStart: `${snsUrl}act-gateway/act-core/act/1/parkour/start`,
  gameSubmit:  `${snsUrl}act-gateway/act-core/act/1/parkour/submit`,
  gameReborn: `${snsUrl}act-gateway/act-core/act/1/parkour/reborn`,
  detail: `${snsUrl}act-gateway/act-core/act/1/parkour/detail`, // 文章详情
  complete: `${snsUrl}act-gateway/act-core/act/1/parkour/complete`, // 阅读完成
  getQuestion: `${snsUrl}act-gateway/act-core/act/1/parkour/getQuestion`, // 获取题目
  submit: `${snsUrl}act-gateway/act-core/act/1/parkour/submit`, // 获取题目提交答案
};


addMock(APIPath);

export const healthInfoIndex = <T = any>(): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.healthInfoIndex, { },{})
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

export const healthInfoDetail = <T = any>(params:any): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.detail, params ,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const gameStart = <T = any>(): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameStart, { },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};


export const gameSubmit = <T = any>(id,score): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameSubmit, { },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const gameReborn = <T = any>(id): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameReborn, { },{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};


export const healthInfoComplete = <T = any>(params:any): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.complete, params,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const getQuestion = <T = any>(params:any): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.getQuestion, params,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const submit = <T = any>(params:any): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.submit, params,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};