/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 23:38:06
 */
import { Message } from './@types/index';
import SocketClient from "./socket";
import Peer from './peer';
import * as EventEmitter from 'eventemitter3'

export interface PeerInit {
  signalServer: string,
  nick: string,
  peerConfig?: RTCConfiguration
}
export default class RTCPeer {
  signalServer: string
  peerConfig: RTCConfiguration
  nick: string
  ws?: SocketClient
  peer?: Peer
  private eventBus: EventEmitter = new EventEmitter()

  constructor ( {
    signalServer,
    nick,
    peerConfig
  }: PeerInit
  ) {
    this.signalServer = signalServer,
    this.nick = nick
    this.peerConfig = peerConfig || {}
  }

  initSocketClient () {
    this.ws = new SocketClient(this.signalServer,this)
  }


  async connectPeer () {    
    if( !this.ws ) {
      this.initSocketClient()
    } 
    const peer = new Peer(
      this.nick,
      this.peerConfig,
      this
    )
    this.peer = peer
    await this.shareUser()
    peer.sendOffer()
  }

  level () {    
    this.peer?.close()
    delete this.peer
    this.ws?.close()
    delete this.ws
    this.eventBus.removeAllListeners()
  }
  

  shareUser (constraints: MediaStreamConstraints = {
    video: true,
    audio: false
  }) {
    if (!this.peer) {
      return 
    }
    return navigator.mediaDevices.getUserMedia(constraints)
    .then( stream => {   
      const peer = this.peer   
      if (peer) {
        peer.media = stream
        console.log(stream);
        
        const tracks = stream.getTracks()
        tracks.forEach( track => {
          peer.addTrack(track, stream)
        }) 
      }else{
        console.log("peer不存在");
        
      }
      
    })
    .catch( err => {
      throw new Error(err)
    })
  }

  on(event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this.eventBus.on(event, fn, context)
  }

  emit(event: string | symbol, ...args: any[]) {
    this.eventBus.emit(event, ...args)
  }

  removeListener(event: string | symbol) {
    this.eventBus.removeListener(event)
  }


  signalSend(message: Message) {
    if (this.ws) {
      this.ws?.send(JSON.stringify(message))
    } else {
      throw new Error("ws is not defined")
    }
  }

}
