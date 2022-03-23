/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:57:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-24 00:08:21
 */

import { Message } from "./@type"
import SocketClient from "./socket"
import EventEmitter from "eventemitter3"
import Peer from "./peer"



class RtcPeer {
  signalServer: string
  socket: SocketClient
  peers: Peer[] = []
  eventBus = new EventEmitter()
  peerConfig: RTCConfiguration
  constructor({signalServer, peerConfig}: {signalServer: string, peerConfig: RTCConfiguration}) {
    this.signalServer = signalServer
    this.peerConfig = peerConfig
    this.socket = new SocketClient({url:this.signalServer, rtcPeer:this})
    return this
  }
  
  connect(id: string, nick: string) {
    const peer = new Peer({
      peer: new RTCPeerConnection(this.peerConfig),
      id,
      nick,
      socket:this.socket
    })
    this.addPeer(peer)
    return peer
  }

  findPeer(id: string) {
    return this.peers.filter(peer => peer.id === id)[0]
  }

  addPeer(peer: Peer) {
    this.peers.push(peer)    
    //通知addpeer    
    this.emit('addPeer', ...this.peers)
  }
  
  receiveIce(message: Message) {    
    const {peerConnection} = this.findPeer(message.userInfo.id)
    peerConnection.addIceCandidate(message.payload as RTCIceCandidateInit)
  }

  level(id: string) {
    this.peers = [...this.peers.filter( peer => peer.id != id)]
    //通知level
  }

  receiveOffer(message: Message) {    
    const peer = this.connect(message.userInfo.id, message.userInfo.nick)
    this.replyAnswer(peer, message.payload as RTCSessionDescriptionInit)
  }
  replyAnswer(peer: Peer, offer: RTCSessionDescriptionInit) {
    const instance = peer.peerConnection
    instance.setRemoteDescription(offer)
    instance.createAnswer()
    .then( answer => {
      instance.setLocalDescription(answer)
      this.socket && this.socket.send({
        type: "answer",
        id: peer.id,
        payload: answer
      })
    })
  }

  on (event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this.eventBus.on(event, fn, context)
  }

  emit (event: string | symbol, ...args: any[]) {
    this.eventBus.emit(event, args)
  }
}

export default RtcPeer