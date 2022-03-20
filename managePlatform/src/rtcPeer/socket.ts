/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:58:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 23:48:37
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
    instance[data.type](data)    
  }

  join(message: Message) {
    if (message.type === 'join' && message.payload){
      this.peer.join(message.id, message.payload.nick)
    }
  }

  offer (message: Message) {
    if(message.type === 'offer' && message.payload) {
      this.peer.receiveOffer(message)
    }
  }

  iceCandidate (message: Message) {
    if(message.type === 'iceCandidate' && message.payload) {
      this.peer.receiveIce(message)
    }
  }
  
  level(message: Message) {
    if(message.type === 'level' && message.id) {
      this.peer.level(message.id)
    }
  }

  send(message: any) {
    this.socket.send(JSON.stringify(message))
  }
}

export default SocketClient