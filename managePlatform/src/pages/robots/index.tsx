/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:43:05
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 23:45:27
 */
import { useEffect, useState } from "react"
import Video from "../../components/video"
import style from "./styles/index.module.less"
import RtcPeer from "../../rtcPeer"
import Peer from "../../rtcPeer/peer"

const Robots = () => {
  const [peers, setPeers] = useState<Peer[]>([])
  const [rtcPeer, setRtcPeer] = useState<RtcPeer>()
  useEffect( () => {
    const rtcPeer = new RtcPeer({
      signalServer:"http://192.168.123.40:8000",
      peerConfig:{
        iceServers:[
          {
            urls:"turn:150.158.187.252:3478",
            username:"adxiong",
            credential: "0417.xyl"
          }
        ]
      }
    })
    rtcPeer.on("addPeer", (peers: Peer[]) => {            
      setPeers([...peers])
    })
    rtcPeer.on("level", (peer: Peer) => {
      setPeers( (peers) => peers.filter(pr => pr.id != peer.id))
    })
    setRtcPeer(rtcPeer)

    return () => {
      rtcPeer.eventBus.removeAllListeners()
    }
  }, [])
  return (
    <div>
      <div className={style.robotList}>
        {
          peers.map( peer => {      
            return <Video peer={peer} key={peer.id}></Video>
          })
        }
      </div>
    </div>
  )
}

export default Robots