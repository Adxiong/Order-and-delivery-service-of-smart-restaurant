/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 20:12:18
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 23:47:54
 */

export interface Peer {
  id: string,
  nick: string,
  stream?: MediaStream,
  peer: RTCPeerConnection
}

export interface PayloadMap {
  join: {
    nick: string
  },
  offer: RTCSessionDescriptionInit ,
  iceCandidate: RTCIceCandidateInit,
  level: {
    nick: string
  }
}

export type Message = {
  [k in keyof PayloadMap]: {
    type: k,
    id: string,
    payload: PayloadMap[k]
  }
}[keyof PayloadMap]