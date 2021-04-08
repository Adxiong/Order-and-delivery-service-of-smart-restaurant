import axios from "axios";
import { Message, Loading } from "element-ui";
import { getToken } from "../utils/index";

const TIMEOUT = 6000;
const service = axios.create({
  baseURL: "https://alongz.cn/",
  timeout: TIMEOUT,
  withCredentials: false // allow cookie
});
//加载等待实例
let loadingInstance;
// 取消请求接口
const CancelToken = axios.CancelToken;
let cancel,
  promiseArr = {};

//请求拦截
service.interceptors.request.use(
  config => {
    console.log(config.headers);
    if (!config.noloading) {
      loadingInstance = Loading.service({
        fullscreen: true,
        lock: true,
        text: "数据加载中…",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.95)",
        customClass: "loading-layer"
      });
    }
    if (promiseArr[config.url]) {
      promiseArr[config.url]("取消请求");
    }
    promiseArr[config.url] = cancel;
    return config;
  },
  error => {
    //提示请求错误
    setTimeout(() => loadingInstance.close(), 1000);
    return Promise.error(error);
  }
);

//响应拦截
service.interceptors.response.use(
  response => {
    setTimeout(() => loadingInstance.close(), 1000);
    return response.data;
  },
  error => {
    //提示响应错误
    setTimeout(() => loadingInstance.close(), 1000);
    if (error && error.response) {
      const { data, status } = error.response;
      Message.error(`${status}: ${data.msg}`);
      return Promise.reject(error);
    } else {
      // 网络错误
      Message.error("请检查您的网络连接！");
      return Promise.error(error);
    }
  }
);

export default {
  async authGet(url, params, noloading) {
    return service({
      method: "get",
      url,
      params,
      headers: { Authorization: "Bearer " + getToken() },
      noloading,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async authPost(url, data, noloading) {
    return service({
      method: "post",
      url,
      data,
      headers: { Authorization: "Bearer " + getToken() },
      noloading,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async authPostNotTimeout(url, data, noloading) {
    return service({
      method: "post",
      url,
      data,
      noloading,
      timeout: 0,
      headers: { Authorization: getToken() },
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async authDelete(url, data, noloading) {
    return service({
      method: "delete",
      url,
      data,
      noloading,
      headers: { Authorization: getToken() },
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async get(url, params, noloading) {
    return service({
      method: "get",
      url,
      params,
      noloading,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async post(url, data, noloading) {
    return service({
      method: "post",
      url,
      data,
      noloading,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
  async delete(url, data, noloading) {
    return service({
      method: "delete",
      url,
      data,
      noloading,
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    });
  },
};