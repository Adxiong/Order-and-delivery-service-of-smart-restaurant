/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 21:21:02
 */
import RTCPeer  from '.';
import * as io from 'socket.io-client';
import { Message } from './@types';
import Peer from './peer';



export default class SocketClient {
  [propsName: string]: any
  url: string 
  socket: io.Socket | null = null
  peer: RTCPeer
  constructor(signalServer: string, rtcPeer: RTCPeer) {    
    this.url = signalServer
    this.peer = rtcPeer
    this.connect()
  }
  
  connect () {
    //存在socket 便不用重新连接
    if (this.socket) return
    
    this.socket = io.connect(this.url, {
      withCredentials: true,
      transports: ['websocket'],
    })

    this.socket.on("connect", () => {
      this.socket?.on("message", (message) => {
        this.handle(message)
      })
      this.socket?.on("disconnect", () => {
        console.log("页面刷新");
      })
    })
  }

  answer(message: Message){
    if(message.type === 'answer'){
      this.peer.peer?.receiveAnswer(message)
    }
  }

  icecandidate(message: Message){
    if(message.type === 'iceCandidate') {
      this.peer.peer?.receiveIceCandidate(message)
    }
  }

  
  level(message: Message){
    if(message.type === 'level'){
      if( this.peer.peer) {
        this.peer.peer.close()
      }
    }
  }

  handle(data: string) {
    const instance: SocketClient = this
    const message: Message = JSON.parse(data) 
    instance[message.type](message)
  }

  send(data: string) {
    this.socket && this.socket.send(data)
  }

  close(){
    this.socket?.emit('level', {
      nick: this.peer.nick,
    })
    this.socket?.close()
  }
}