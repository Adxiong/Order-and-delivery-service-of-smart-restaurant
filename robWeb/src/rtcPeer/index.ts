/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:20
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:49:27
 */
import { DcMessage, JoinParam, Message, PeerInfo } from './@types/index';
import SocketClient from "./socket";
import { Local } from './@types/index';
import Peer from './peer';
import * as EventEmitter from 'eventemitter3'

export interface PeerInit {
  signalServer: string,
  peerConfig?: RTCConfiguration
}
export default class RTCPeer {
  signalServer: string
  peerConfig: RTCConfiguration
  public local: Local
  ws?: SocketClient
  private eventBus: EventEmitter = new EventEmitter()

  constructor ( {
    signalServer,
    peerConfig
  }: PeerInit
  ) {
    this.signalServer = signalServer,
    this.peerConfig = peerConfig || {}
    this.local = {
      id: "",
      nick: "",
      roomId: "",
      peers: [],
      media: {},
      trackTag: ""
    }
  }

  initSocketClient () {
    this.ws = new SocketClient(this.signalServer,this)
  }

  join({roomId, nick}: JoinParam) {
    if( !this.ws ) {
      this.initSocketClient()
    } 
    
    const { local } = this

    if(nick) local.nick = nick


    const message: Message = {
      type: "join",
      receiveId: null,
      payload: {
        roomId,
        nick
      }
    }

    this.signalSend(message)
    

  }


  connectPeer (peerInfo: PeerInfo) {    
    const peer = new Peer(
      peerInfo.id,
      peerInfo.nick,
      this.peerConfig,
      this
    )
    this.addPeer(peer)
    peer.connect()
    return peer
  }

  level () {    
    this.local.media.user?.getTracks().forEach( track => track.stop())
    this.local.media.display?.getTracks().forEach( track => track.stop())
    delete this.local.media.user
    delete this.local.media.display
    this.local.peers.forEach( peer => {
      peer.close()
    })
    this.local.peers = []
    this.ws?.close()
    delete this.ws
    this.eventBus.removeAllListeners()
  }
  
  
  addPeer (peer: Peer) {
    this.local.peers.push(peer)
    this.emit('addPeer', this.local.peers)
  }

  findPeer (id: string) {
    return this.local.peers.find( peer => peer.id == id)
  }

  shareUser (constraints: MediaStreamConstraints = {
    video: true,
    audio: true
  }) {
    const { local } = this
    
    return navigator.mediaDevices.getUserMedia(constraints)
    .then( stream => {      
      local.media.user = stream
      const tracks = stream.getTracks()
      let trackTag = tracks.map(track => `[user/${track.id}]`).join('')
      this.local.trackTag = trackTag            
      this.local.peers.forEach( peer => {
        tracks.forEach( track => {
          peer.addTrack(track, stream)
        }) 
      })
      this.emit('localStream', stream, 'user')
      return local
    })
    .catch( err => {
      throw new Error(err)
    })
  }

  shareDisplay (constraints: DisplayMediaStreamConstraints) {
    const { local } = this
    navigator.mediaDevices.getDisplayMedia(constraints)
    .then( stream => {
      console.log(stream);
      
      this.local.media.display = stream
      const tracks = stream.getTracks()
      let trackTag = tracks.map(track => `[display/${track.id}]`).join('')
      this.local.trackTag = trackTag

      this.local.peers.forEach( peer => {
        tracks.forEach( track => {
          peer.addTrack(track, stream)
        })
      })
      this.emit("localStream", stream, 'display')
      return local
    })
    .catch( err => {
      throw new Error(err)
    })
  }

  pushLocalStream (peer: Peer) {
    const {user, display} = this.local.media
    let trackTag = ""
    if(user){
      user.getTracks().forEach( track => {
        trackTag += `[user/${track.id}]`
        peer.addTrack(track, user)
      })
    }
    if (display) {
      display.getTracks().forEach( track => {
        trackTag +=  `[display/${track.id}]`
        peer.addTrack(track, display)
      })
    }
    this.local.trackTag = trackTag
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

  send(message: DcMessage){
    const sendMessage = JSON.stringify(message)
    this.local.peers.forEach( peer => {
      peer.send(sendMessage)
    })
  }
}