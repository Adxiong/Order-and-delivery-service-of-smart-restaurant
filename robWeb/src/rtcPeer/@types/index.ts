/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:50:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 21:24:24
 */


import Peer from "../peer";


interface payloadMap {
  join: {
    nick: string
  }
  
  offer: RTCSessionDescriptionInit
  answer: RTCSessionDescriptionInit
  icecandidate: RTCIceCandidateInit

}


export type Message  = {
  [k in keyof payloadMap]: {
    type: string,
    payload: payloadMap[k],
    nick: string
  }
}[keyof payloadMap]
