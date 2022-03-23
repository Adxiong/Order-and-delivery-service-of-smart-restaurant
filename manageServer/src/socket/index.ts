/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 15:51:27
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-24 00:04:25
 */

import * as io from 'socket.io'
import logger from '../utils/logger'

interface SocketClientType {
  userInfo: {
    id: string,
    nick: string
  },
}

export default class SocketServer {
  socket: io.Server
  superAdmin: {
    id: string,
    nick: string
  }

  constructor(server){
    this.socket =  new io.Server(server)
    this.registerEventListen()
  }
  
  registerEventListen () {
    this.socket.on('connect', (socket) => {      
      console.log(socket);
       
      socket['userInfo'] = {
        id: socket.id,
        nick: ""
      }
      if( !this.socket['client']) this.socket['client'] = []       
      this.socket['client'].push(socket)
      socket.on('message', (data) => {   
        const message = JSON.parse(data)
        this[message.type](socket,message)
      })

      socket.on('disconnect', () => {
        console.log("断开链接===》",socket);
        //监控平台断开链接，通知所有设备。
        //设备断开连接，通知监控平台
        if(socket.id === this.superAdmin.id) {
          this.socket['client'] = this.socket['client'].filter( client => client['userInfo'].id != socket.id)        
          this.superAdmin = {
            id: "",
            nick: ""
          }
          this.dispatchAll({
            type: "level",
            payload: {
              msg: "服务端断开连接，请稍后重新连接"
            }
          })
        } else {
          //从连接池中删除退出的连接，并通知监控平台
          this.socket['client'] = this.socket['client'].filter( client => client['userInfo'].id != socket.id)        
          this.sendToUser(this.superAdmin.id, JSON.stringify({
            type: 'level',
            payload: {
              id: socket['userInfo'].id,
              nick: socket['userInfo'].nick
            }
          }))
        }
        
      })
    }) 

  }

  join(socket: io.Socket, data) {
    //管理平台超级用户进入
    this.superAdmin = {
      id: socket.id,
      nick: data.nick
    }
    socket['userInfo'].nick = data.nick
    logger.info(`id=${this.superAdmin.id} 的 ===》${this.superAdmin.nick} 加入`)
  }

  dispatchAll (data) {
    this.socket['client'].forEach(client => {
      client.send(JSON.stringify(data))
    });
  }

  sendToUser (receiveId, data  ) {
    this.socket['client'].forEach( client => {      
      if (client['userInfo']['id'] == receiveId) {
        client.send(JSON.stringify(data))
      }
    });
  }

  offer (socket, message) {    
    socket['userInfo'].nick = message.nick
    this.sendToUser(this.superAdmin.id, {
      ...message,
      userInfo: socket['userInfo']
    })
  }

  answer (socket, message) {    
    this.sendToUser( message.id, {
      ...message,
      userInfo: socket['userInfo']
    })
  }

  icecandidate (socket, message) {   
    if( socket.id === this.superAdmin.id ) {
      this.sendToUser( message.id, {
        ...message,
        userInfo: socket['userInfo']
      })
    } else {
      this.sendToUser( this.superAdmin.id, {
        ...message,
        userInfo: socket['userInfo']
      })
    }
    
  }

}