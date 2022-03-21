/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:16
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:48:20
 */
import RTCPeer  from '.';
import * as io from 'socket.io-client';
import { Message } from './@types';
import Peer from './peer';
import { PeerInfo } from './@types/index';



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


  roomInfo(message: Message) {

    if(message.type === 'roomInfo') {
      const {users, userInfo} = message.payload as {userInfo: PeerInfo, users: PeerInfo[]}      
      this.peer.local.id = userInfo.id
      this.peer.local.nick = userInfo.nick
      users.
      forEach( peerInfo => {
        this.peer.connectPeer(peerInfo)
      });
      this.peer.emit('roomInfo', users)
    }
  }

  offer(message: Message){
    /**
     * 收到offer  message里有userinfo。根据userInfo查找peer 没有查到就创建rtc -> add -> connect
     * 找到直接用peer.replyanswer（）
     */        
    if(message.userInfo && message.type === 'offer') {
      const { id, nick } = message.userInfo
      let peer = this.peer.findPeer(id)
      if( !peer ) {
        peer = new Peer(
          id,
          nick,
          this.peer.peerConfig ,
          this.peer
        )
        this.peer.addPeer(peer)
        peer.connect()
        this.peer.pushLocalStream(peer)
      }
      
      peer.receiveOffer(message)
    }
   
  }

  answer(message: Message){
    if(message.userInfo && message.type === 'answer'){
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)
      peer?.receiveAnswer(message)
    }
  }

  icecandidate(message: Message){
    if(message.userInfo && message.type === 'icecandidate') {
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)      
      peer?.receiveIceCandidate(message)
    }
  }

  newUserJoin(message: Message) {
    if(message.userInfo) {
      const {id} = message.userInfo
      // this.peer.emit('roomInfo', [message.userInfo])      
    }
  }
  
  level(message: Message){
    
    if(message.type === 'level' && message.userInfo){
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)
      if( peer) {
        peer.close()
        this.peer.local.peers = this.peer.local.peers.filter( p => p.id != id)
      }

      this.peer.emit("level",this.peer.local.peers)

    }
  }

  handle(data: string) {
    const instance: SocketClient = this
    const message: Message = JSON.parse(data) 
    instance[message.type](message)
  }

  sendMessage(chatInfo: {[propName: string]: string}) {
    this.socket && this.socket.emit('message',JSON.stringify(chatInfo))
  }

  send(data: string) {
    this.socket && this.socket.send(data)
  }

  close(){
    this.socket?.emit('level', {
      id: this.peer.local.id,
      nick: this.peer.local.nick,
      roomId: this.peer.local.roomId
    })
    this.socket?.close()
  }
}