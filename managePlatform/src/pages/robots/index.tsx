/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:43:05
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 15:59:33
 */
import { useState } from "react"
import Video from "../../components/video"
import style from "./styles/index.module.less"

const Robots = () => {
  const [peers, setPeers] = useState(new Array(10).fill({nick:"abc"}))
  return (
    <div>
      <div className={style.robotList}>
        {
          peers.map( peer => {
            return <Video peer={peer}></Video>
          })
        }
      </div>
    </div>
  )
}

export default Robots