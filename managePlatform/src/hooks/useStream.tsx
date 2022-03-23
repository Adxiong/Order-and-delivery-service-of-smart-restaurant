/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 15:42:28
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-24 00:16:24
 */

import { useEffect, useState } from "react"
import Peer from "../rtcPeer/peer"

const UseStream = (peer: Peer) => {  
  const [stream, setStream] = useState<MediaStream>()
  useEffect( () => {
    peer.on("track", (stream: MediaStream) => {
      console.log(stream[0]);
      
      setStream(stream[0])
    })
  },[peer])
  return stream
}

export default UseStream