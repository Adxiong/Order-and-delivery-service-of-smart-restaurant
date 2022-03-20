/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 19:57:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 22:01:28
 */

import { Peer, Message } from "./@type"
import SocketClient from "./socket"


class RtcPeer {
  signalServer: string
  socket?: SocketClient
  peers: Peer[] = []
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
      peer: new RTCPeerConnection()
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
  }

  replyAnswer(peer: Peer, message: Message) {
    const instance = peer.peer
    if (message.type === "offer"){
      instance.setRemoteDescription(message.payload as RTCSessionDescriptionInit)
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
  }

  registerPeerEvent(instance : Peer) {
    instance.peer.addEventListener("icecandidate", (data) => {
      //send icecandidate
    })

    instance.peer.addEventListener('track', (event: RTCTrackEvent) => {
      instance.stream = event.streams[0]
      //发送通知
    })

    instance.peer.addEventListener("datachannel", (event) => {
      console.log(event);
      
    })
  }

}

export default RtcPeer