/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 23:45:25
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:49:02
 */


import EventEmitter from "eventemitter3"
import RTCPeer from "."
import { DcMessage, Media, Message } from "./@types"

export default class Peer {
  id: string
  nick: string
  public media: Media = {}
  private peerConnection: RTCPeerConnection
  private rtcPeerInstance: RTCPeer
  private isPeerConnected: boolean = false
  private dataChannel?: RTCDataChannel
  private eventBus: EventEmitter = new EventEmitter()
  constructor (
    id: string,
    nick: string,
    peerconfig: RTCConfiguration,
    rtcPeerInstance: RTCPeer) {
    this.id = id
    this.nick = nick
    this.peerConnection = new RTCPeerConnection(peerconfig)
    this.rtcPeerInstance = rtcPeerInstance
    this.initPeerEvents()
  }

  connect() {
    if (this.isPeerConnected) {
      return Promise.reject("peer is already connected")
    } 

    const {peerConnection} = this
    
    return new Promise( (resolve , reject) => {
      const dc = peerConnection.createDataChannel("DC")      
      dc.addEventListener('open', () => {        
        this.dataChannel = dc
        this.isPeerConnected = true
                
        resolve("连接成功")
        //发送连接事件
        this.rtcPeerInstance.emit('connected', this)
        
      })

      setTimeout(() => {
        reject( new Error("连接超时"))
      }, 10*1000);
    })
  }

  receiveOffer (message: Message) {
    if (message.type === 'offer') {      
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload as RTCSessionDescriptionInit))
      .then( () => this.replyAnswer(message))
    }
  }

  receiveAnswer(message: Message) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload as RTCSessionDescriptionInit))
  }

  receiveIceCandidate(message: Message) {        
    this.peerConnection.addIceCandidate(new RTCIceCandidate(message.payload as RTCIceCandidateInit))
  }

  replyAnswer(message: Message) {    
    if (message.userInfo &&  message.type === 'offer') {
      const {id} = message.userInfo
      this.peerConnection.createAnswer()
      .then( (answer) => 
        this.peerConnection.setLocalDescription(answer).then( () => answer)
      )
      .then( (answer) => {
        const sendMessage = {
          type: "answer",
          receiveId: id,
          payload: answer
        }        
        this.rtcPeerInstance.signalSend(sendMessage)
      })
      .catch( (error) => {
        throw new Error(`replayAnswer error ==> ${error} `)
      })
    }
  }


  initPeerEvents () {
    const pc = this.peerConnection

    pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
      if ( event.candidate) {
        //发送ice
        this.rtcPeerInstance.signalSend({
          type: "icecandidate",
          receiveId: this.id,
          payload: event.candidate
        })        
      }
    })


    pc.addEventListener('track', (event: RTCTrackEvent ) => {
      const peer = this
      const stream = event.streams[0]      
      const sdp = event.target.remoteDescription.sdp.toString()

      const setUserStream = () => {
        if (!this.media.user || this.media.user.id != stream.id) {
          peer.media.user = stream
          peer.emit("remoteStream", stream, "user")    
        } 
      }
      const setDisplayStram = () => {
        if (!this.media.display || this.media.display.id != stream.id){
          this.media.display = stream
          peer.emit('remoteStream', stream, "display")
        }
      }

      const streamType = this.detectTrackType(sdp, event.track)
      

      if (streamType === 'user') setUserStream()
      else if (streamType === 'display') setDisplayStram()

    })

    pc.addEventListener('negotiationneeded', () => {      
      pc.createOffer()
      .then( offer => {
        offer.sdp = this.setTrackTagToSdp(offer.sdp, this.rtcPeerInstance.local.trackTag)        
        pc.setLocalDescription(offer).then( () => {
          this.rtcPeerInstance.emit('negotiationneeded:done', this)
          this.rtcPeerInstance.signalSend({
            type: 'offer',
            receiveId: this.id,
            payload: offer
          })
        })
      })
    })

    pc.addEventListener('datachannel', (event) => {    
      const dc = event.channel   
      dc.onmessage = (event) => {
        console.log(event.data);
        
        this.rtcPeerInstance.emit('message:dc', JSON.parse(event.data) as DcMessage)
      }
    })
  }


  setTrackTagToSdp(sdp: string = '', trackTag: string) {
    
    const sdpSplit = sdp.split('\n')
    for(let i = 0 ; i < sdpSplit.length ; i++) {
      sdpSplit[i] = sdpSplit[i].replace(/(a=extmap:[0-9]+) [^ \n]+/ig, `$1 ${trackTag}`)
    }
    
    return sdpSplit.join('\n')
  }

  detectTrackType(sdp: string, track: MediaStreamTrack) {
    if (sdp.indexOf(`[user/${track.id}]`) !== -1) {
      return 'user'
    }
    else if (sdp.indexOf(`[display/${track.id}]`) !== -1){
      return 'display'
    }
  }

  addTrack (track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.peerConnection.addTrack(track, ...streams)
  }

  send(message: string) {
    this.dataChannel?.send(message)
  }
  close() {
    this.peerConnection.close()
    this.isPeerConnected = false
    this.eventBus.removeAllListeners()
  }

  removeListener(event: string | symbol) {
    this.eventBus.removeListener(event)
  }

  on(event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this.eventBus.on(event, fn, context)
  }

  emit(event: string | symbol, ...args: any[]) {
    this.eventBus.emit(event, ...args)
  }

}