/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 20:12:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 21:37:49
 */



export interface PayloadMap {
  join: {
    nick: string
  },
  offer: RTCSessionDescriptionInit ,
  icecandidate: RTCIceCandidateInit,
  level: {
    nick: string
  }
}

export type Message = {
  [k in keyof PayloadMap]: {
    type: k,
    id: string,
    payload: PayloadMap[k],
    userInfo: {
      id: string,
      nick: string
    }
  }
}[keyof PayloadMap]