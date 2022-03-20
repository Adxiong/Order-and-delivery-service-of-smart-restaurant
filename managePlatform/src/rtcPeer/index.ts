/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:57:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 23:56:58
 */

import { Peer, Message } from "./@type"
import SocketClient from "./socket"
import EventEmitter from "eventemitter3"


class RtcPeer {
  signalServer: string
  socket?: SocketClient
  peers: Peer[] = []
  eventBus = new EventEmitter()
  constructor(signalServer: string) {
    this.signalServer = signalServer

  }

  connect() {
    this.socket = new SocketClient({url:this.signalServer, rtcPeer:this})
  }

  join(id: string, nick: string) {
    const instance: Peer = {
      id,
      nick,
      peer: new RTCPeerConnection(),
    }
    const dc = instance.peer.createDataChannel("dc")
    this.registerPeerEvent(instance)
    this.addPeer(instance)
  }

  findPeer(id: string) {
    return this.peers.filter(peer => peer.id === id)[0]
  }

  addPeer(peer: Peer) {
    this.peers.push(peer)
    //通知addpeer
  }
  
  receiveIce(message: Message) {
    const {peer} = this.findPeer(message.id)
    peer.addIceCandidate(message.payload as RTCIceCandidateInit)
  }

  level(id: string) {
    this.peers = [...this.peers.filter( peer => peer.id != id)]
    //通知level
  }

  receiveOffer(message: Message) {
    const peer = this.findPeer(message.id)
    this.replyAnswer(peer, message.payload as RTCSessionDescriptionInit)
  }
  replyAnswer(peer: Peer, offer: RTCSessionDescriptionInit) {
    const instance = peer.peer
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

  registerPeerEvent(instance : Peer) {
    instance.peer.addEventListener("icecandidate", (event) => {
      if(event.candidate) {
        this.socket?.send({
          type: "iceCandidate",
          id: instance.id,
          payload: event.candidate
        })
      }
    })

    instance.peer.addEventListener('track', (event: RTCTrackEvent) => {
      instance.stream = event.streams[0]
      //发送通知
    })

    instance.peer.addEventListener("datachannel", (event) => {
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

export default RtcPeer