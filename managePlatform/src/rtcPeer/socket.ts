/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:58:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 22:05:44
 */


import * as io from "socket.io-client";
import { json } from "stream/consumers";
import RtcPeer from ".";
import { Message } from "./@type";

interface SocketParams {
  url: string
  rtcPeer: RtcPeer
}

class SocketClient {
  socket: io.Socket
  peer: RtcPeer
  constructor({url, rtcPeer}: SocketParams) {
    this.socket = io.connect(url, {transports: ["websocket"]})    
    this.peer = rtcPeer
  }

  registerListenEvent(socket: io.Socket) {
    socket.on("connect", () => {
      socket.on("message", (message: string) => {
        this.handel(message)
      })
    })
  }


  handel(message: string) {
    const instance = this
    const data: Message = JSON.parse(message)
    instance[data.type](message)    
  }

  join(message: Message) {
    if (message.type === 'join' && message.payload)
    this.peer.join(message.id, message.payload.nick)
  }

  offer (message: Message) {

  }

  icecandidate (message: Message) {

  }
  
  level(message: Message) {

  }

  send(message: Message) {
    this.socket.send(JSON.stringify(message))
  }
}

export default SocketClient