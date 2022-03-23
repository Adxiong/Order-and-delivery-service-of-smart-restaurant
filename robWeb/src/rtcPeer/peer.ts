/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 23:35:18
 */


import RTCPeer from "."
import { Message } from "./@types"

export default class Peer {
  nick: string
  public media?: MediaStream
  private peerConnection: RTCPeerConnection
  private rtcPeerInstance: RTCPeer
  constructor (
    nick: string,
    peerconfig: RTCConfiguration,
    rtcPeerInstance: RTCPeer) {
    this.nick = nick
    this.peerConnection = new RTCPeerConnection(peerconfig)
    this.rtcPeerInstance = rtcPeerInstance
    this.initPeerEvents()
  }

  sendOffer () {
    const pc = this.peerConnection
    pc.createOffer()
    .then( offer => {
      pc.setLocalDescription(offer).then( () => {
        this.rtcPeerInstance.signalSend({
          type: 'offer',
          nick: this.nick,
          payload: offer
        })
      })
    })
  }

  receiveAnswer(message: Message) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload as RTCSessionDescriptionInit))
  }

  receiveIceCandidate(message: Message) {        
    this.peerConnection.addIceCandidate(new RTCIceCandidate(message.payload as RTCIceCandidateInit))
  }

  initPeerEvents () {
    const pc = this.peerConnection    
    pc.addEventListener("icecandidate", (event: RTCPeerConnectionIceEvent) => {
      console.log("chufa");
      
      if ( event.candidate) {
        //发送ice
        console.log(event.candidate);
        
        this.rtcPeerInstance.signalSend({
          type: "icecandidate",
          nick: this.nick,
          payload: event.candidate
        })        
      }
    })
  }



  addTrack (track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.peerConnection.addTrack(track, ...streams)
  }

  close() {
    this.media?.getTracks().forEach(track => {
      track.stop()
    });
    this.peerConnection.close()
  }

}