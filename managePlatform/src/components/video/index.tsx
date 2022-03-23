/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 15:38:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:38:17
 */
import { useEffect, useRef } from "react"
import useStream from "../../hooks/useStream"
import Peer from "../../rtcPeer/peer"
import style from "./styles/index.module.less"

const Video = ({peer}: {peer: Peer}) => {
  const stream = useStream(peer)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect( () => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream, videoRef])

  return (
    <div className={style.VideoWrap}>
      <video autoPlay className={style.video}></video>
      <span className={style.name}>{peer.nick??"未知设备"}</span>
    </div>
  )
}

export default Video

