/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:50:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-22 15:28:06
 */


import Peer from "../peer";


export interface PeerInfo {
  id: string,
  nick: string
}

export interface Media {
  display?: MediaStream,
  user?: MediaStream
}

export interface Local {
  id: string,
  nick: string,
  roomId: string,
  trackTag: string,
  peers: Peer[],
  media: Media
}

interface payloadMap {
  join: {
    roomId: string,
    nick: string
  }

  roomInfo: {
    userInfo: PeerInfo
    users: PeerInfo[]
  }
  
  offer: RTCSessionDescriptionInit
  answer: RTCSessionDescriptionInit
  icecandidate: RTCIceCandidateInit
  level: PeerInfo
  
}

export interface DcMessage {
  [propName: string]: any
  sendId: string,
  sendNick: string,
  content: string,
  sendTime: string
}

export type Message  = {
  [k in keyof payloadMap]: {
    type: string,
    receiveId: string | null,
    payload: payloadMap[k],
    userInfo?: {
      id: string,
      nick: string
    }
  }
}[keyof payloadMap]

export interface JoinParam {
  roomId: string,
  nick: string
}

interface key {
  aaa: string,
  bbb: string
}

function apis() {
  return {
    aaa: "aaa",
    bbb: "bbb"
  } as  key
}

const api: key = apis()

api.