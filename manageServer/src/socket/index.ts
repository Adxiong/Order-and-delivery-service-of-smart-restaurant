/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 15:51:27
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:52:30
 */

import * as io from 'socket.io'
import logger from '../utils/logger'

interface SocketClientType {
  userInfo: {
    id: string,
    nick: string
  },
  roomId: string
}

export default class SocketServer {
  socket: io.Server

  constructor(server){
    this.socket =  new io.Server(server)
    this.registerEventListen()
  }
  
  registerEventListen () {
    this.socket.on('connect', (socket) => { 
      socket['userInfo'] = {
        id: socket.id
      }   
      if( !this.socket['client']) this.socket['client'] = []       
      this.socket['client'].push(socket)
      socket.on('message', (data) => {
        const message = JSON.parse(data)
        this[message.type](socket,message)
      })

      socket.on('disconnect', () => {
        console.log("断开链接===》",socket);
        
        this.socket['client'] = this.socket['client'].filter( client => client['userInfo'].id != socket.id)        
        this.boradCaseToRoom(socket['userInfo'], JSON.stringify({
          type: 'level',
          userInfo: socket['userInfo'],
        })) 

      })
    }) 

  }

  join(socket: io.Socket, data) {
    console.log(data.payload);
    const userInfo = {
      id: socket['userInfo'].id,
      nick: data.payload.nick,
      roomId: data.payload.roomId
    }
    logger.info(`id=${userInfo.id} 的 ===》 ${userInfo.nick} 加入房间 ${userInfo.roomId}`)

    socket['userInfo'] = userInfo
        
    const roomUserList = this.getRoomUserList(userInfo.roomId, userInfo)
    
    socket.send( 
      JSON.stringify(      {
        type: "roomInfo",
        payload: {
          users: roomUserList,
          userInfo
        }
      } )
    )

    this.boradCaseToRoom(userInfo,JSON.stringify(      {
      type: "newUserJoin",
      payload: {},
      userInfo
    } )
    )
  }

  getRoomUserList (roomId,userInfo) {    
    return Array.from(this.socket['client'])
    .map( client => client['userInfo'])
    .filter( userInfo => userInfo.roomId == roomId)
    .filter(user => user.id !== userInfo.id)
  }

  sendToRoom (userInfo, data) {
    this.socket['client'].forEach( client => {
      if (client['userInfo']['roomId'] == userInfo.roomId ) {        
        client.send(JSON.stringify(data))
      }
    });
  }

  boradCaseToRoom (userInfo, data) {
    this.socket['client'].forEach( client => {
      if (client['userInfo']['roomId'] == userInfo.roomId && client['userInfo']['id'] != userInfo.id ) {        
        client.send(data)
      }
    });
  }

  sendToUser (receiveId, data  ) {
    this.socket['client'].forEach( client => {      
      if (client['userInfo']['id'] == receiveId) {
        client.send(JSON.stringify(data))
      }
    });
  }

  /**
   * 加入房间，房间已存在用户大于1，新加入的用户发送offer 
   * 
   * 发送者 createOffer => setLocalDescription => sendOffer
   * 
   * 接受者 setRemoteDescription => createAnswer => setLocalDescription => sendAnswer
   * 
   * 收到offer 给该房间内除自己以外的用户转发offer  「 sendId , offer 」
   * 收到answer 返回给发送offer的人     [ receiveId, answer]
   */

  offer (socket, message) {
    
    this.sendToUser(message.receiveId, {
      ...message,
      userInfo: socket['userInfo']
    })
  }

  answer (socket, message) {    
    this.sendToUser( message.receiveId, {
      ...message,
      userInfo: socket['userInfo']
    })
  }

  icecandidate (socket, message) {    
    this.sendToUser( message.receiveId, {
      ...message,
      userInfo: socket['userInfo']
    })
  }

}