/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 14:56:05
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 21:58:33
 */

import EventEmitter from "eventemitter3"
import SocketClient from './socket';


interface PeerParams {
  peer: RTCPeerConnection,
  id: string,
  nick: string,
  socket: SocketClient
}

class Peer {
  id: string
  nick: string
  peerConnection: RTCPeerConnection
  socket: SocketClient
  eventBus = new EventEmitter()

  constructor({peer, id, nick, socket}: PeerParams) {
    this.peerConnection = peer
    this.id = id 
    this.nick = nick
    this.socket = socket
    this.registerEventListener(peer)
    return this
  }


  registerEventListener (peer: RTCPeerConnection) {
    peer.addEventListener("track", (event) => {
      const stream = event.streams[0]
      //通知
      console.log(stream);
      
    })
    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        this.socket.send({
          type: "icecandidate",
          id: this.id,
          payload: event.candidate
        })
      }
    })

    peer.addEventListener("datachannel", (event) => {
      console.log(event);
      
    })
  }


  on (event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this.eventBus.on(event, fn, context)
  }

  emit (event: string | symbol, ...args: any[]) {
    this.eventBus.emit(event, args)
  }
  
}

export default Peer