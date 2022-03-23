/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 15:42:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:38:27
 */

import { useEffect, useState } from "react"
import Peer from "../rtcPeer/peer"

const UseStream = (peer: Peer) => {
  const [stream, setStream] = useState<MediaStream>()
  useEffect( () => {
    peer.on("track", (stream: MediaStream) => {
      setStream(stream)
    })
  },[peer])
  return stream
}

export default UseStream