/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:46:44
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:46:45
 */
   
import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler, CancelToken } from "axios";
import { ResponseStatus } from '../models/commons';
const CancelToken = axios.CancelToken
let cancel: Canceler

const requestQueue: {
  [propsKey: string]: Canceler
} = {}

class Request {
  config: any;
  axios: AxiosInstance | undefined;
  constructor () {
    this.createAxios()
    this.interceptors()
  }
  createAxios () {
    this.axios = axios.create({
      timeout: 6000,
      withCredentials: true
    })
  }
  interceptors () {
    if (this.axios) {
      this.axios.interceptors.request.use( (config: AxiosRequestConfig) => {
        if (requestQueue[config.url as string]) {
          requestQueue[config.url as string]()
        }
        requestQueue[config.url as string] = cancel
        
        return config
      }, error => {
        return Promise.reject(error)
      })
      this.axios.interceptors.response.use( response => {   
        return response.data
      }, error => {
        if (error && error.response) {
          const {data, status} = error.response;
          message.error({
            content: `${status}:数据异常`,
            duration: 1,
            top: 10
          })
          return Promise.reject(error)
        } else {
          message.error({
            content: `网络异常`,
            duration: 1,
            top: 10
          })
          return Promise.reject(error)
        }
      })    
    }
  }
  
  async get <T> (url: string, params: any): Promise<T> {
    return new Promise( (resolve, reject) => {
      if (this.axios) {
        this.axios.request({
          url,
          params,
          cancelToken: new CancelToken( c => {
            cancel = c
          } )
        })
        .then( (res: AxiosResponse) => {
          resolve(res.data)
        })
        .catch( err => {
          reject(err)
        })
      } else {
        reject("找不到axios实例对象")
      }
    })
  }

  async post<T> (url: string, data: any): Promise<T> {
    return new Promise( (resolve, reject) => {
      if( this.axios ) {
        this.axios.request({
          method: 'post',
          url,
          data,
          cancelToken: new CancelToken( c => {
            cancel = c
          })
        })
        .then( (res: AxiosResponse) => {
          resolve(res.data)
        })
        .catch( err => {
          reject(err)
        })
      } else {
        reject("找不到axios实例对象")
      }
    })
  }

  async delete (url: string, id: string) {
    if (this.axios){
      return this.axios.request({
        method: "delete",
        url,
        params: {
          id
        },
        cancelToken: new CancelToken( c => {
          cancel = c
        })
      })
    }
  }
}

export default new Request()
