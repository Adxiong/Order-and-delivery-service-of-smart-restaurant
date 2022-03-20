/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 15:38:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 15:55:29
 */
import { useEffect, useRef } from "react"
import useStream from "../../hooks/useStream"
import style from "./styles/index.module.less"

const Video = ({peer}) => {
  const stream = useStream(peer)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect( () => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className={style.VideoWrap}>
      <video autoPlay className={style.video}></video>
      <span className={style.name}>{peer.nick??"未知设备"}</span>
    </div>
  )
}

export default Video
