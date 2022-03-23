/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:58:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 21:37:54
 */


import * as io from "socket.io-client";
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
    this.socket = io.connect(url, {
      transports: ["websocket"],
      withCredentials: true,
    })    
    this.peer = rtcPeer
    this.registerListenEvent(this.socket)
    this.join()
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

  join() {
    this.send({
      type: "join",
      nick: "superAdmin"
    })
  }

  offer (message: Message) {
    if(message.type === 'offer' && message.payload) {
      this.peer.receiveOffer(message)
    }
  }

  icecandidate (message: Message) {
    if(message.type === 'icecandidate' && message.payload) {
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