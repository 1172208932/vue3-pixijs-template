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
  detail: `${snsUrl}act-gateway/act-core/act/1/parkourRead/detail`, // 文章详情
  complete: `${snsUrl}act-gateway/act-core/act/1/parkourRead/complete`, // 阅读完成
  getQuestion: `${snsUrl}act-gateway/act-core/act/1/parkourAnswer/getQuestion`, // 获取题目
  chooseSubmit: `${snsUrl}act-gateway/act-core/act/1/parkourAnswer/submit`, // 获取题目提交答案
  taskList: `${snsUrl}act-gateway/act-core/act/1/task_2/queryTasks`, // 任务列表
  completeTask: `${snsUrl}act-gateway/act-core/act/1/task_2/completeTask`, // 任务列表
  readIndex: `${snsUrl}act-gateway/act-core/act/1/parkourRead/index`, // 获取消保快乐学
  receiveTaskPrize: `${snsUrl}act-gateway/act-core/act/1/task_2/receiveTaskPrize`, // 领取任务奖励
};
if(import.meta.env.VITE_APP_EN === "development"){
  addMock(APIPath);
}

export const healthInfoIndex = <T = any>(): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.healthInfoIndex, { },{})
      .then((res) => {
        if(res["success"]){
          resolve(res.data);
        }
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const readIndex = <T = any>(): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.readIndex, { },{})
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

export const gameStart = <T = any>(): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameStart, { },{})
      .then((res) => {
        // if(res['success']){
          resolve(res);
        // }
    })
      .catch((err) => {
        reject(err);
    });
  });
};


export const gameSubmit = <T = any>(id,score): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameSubmit, {startId: id, score:score},{})
      .then((res) => {
        resolve(res);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const gameReborn = <T = any>(id): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.gameReborn, {startId: id },{})
      .then((res) => {
        resolve(res);
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

export const chooseSubmit = <T = any>(params:any): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.chooseSubmit, params,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const completeTask = <T = any>(): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.completeTask, {taskCode: 'share'},{})
      .then((res) => {
        resolve(res);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const taskList = <T = any>(): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.taskList, {},{})
      .then((res) => {
        resolve(res);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const receiveTaskPrize = <T = any>(params): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(APIPath.receiveTaskPrize, params,{})
      .then((res) => {
        resolve(res);
    })
      .catch((err) => {
        reject(err);
    });
  });
};

export const callApi = <T = any>(url,params): Promise<any> => {
  return new Promise((resolve, reject) => {
    NbRequest.get(url, params,{})
      .then((res) => {
        resolve(res.data);
    })
      .catch((err) => {
        reject(err);
    });
  });
};
