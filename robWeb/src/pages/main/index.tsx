/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 21:39:26
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 23:44:58
 */
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import { useContext, useEffect, useRef, useState } from "react"
import style from "./styles/index.module.less"
import { AudioOutlined } from "@ant-design/icons"
import { SettingOutlined } from '@ant-design/icons'
import { Form, Modal } from 'antd'
import UserConfig from '../UserConfig'
import {StoreContext} from "../../store"
import SocketClient from "../../rtcPeer/socket"
import RTCPeer from "../../rtcPeer"
import { message as antdMessage } from "antd"

const Main = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState<string>()
  const [isSpeak, setIsSpeak] = useState<boolean>(false)
  const syc = window.speechSynthesis
  const [isSetting, setIsSetting] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { store, dispatch } = useContext(StoreContext)


  
  const commands = [
    {
      command: "吃*",
      callback: (name) => {
        const msg = `你也吃${name}啊`
        setMessage(msg) 
      }
    },
    {
      command: "*号餐桌送餐",
      // isFuzzyMatch: true,
      callback: (num) => {
        const msg = `正在出发，给${num}号餐桌送餐`
        setMessage(msg)
      }
    },
    {
      command: "小度小度",
      callback: () => {
        const msg = `我在！有什么可以帮到你`
        setTimeout(() => {
          setMessage(msg) 
        }, 1000);
      }
    }
  ]
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({commands})
  
  useEffect( () => {
    return () => {
      setMessage("")
    }
  }, [contentRef])

  useEffect( () => {
    if(!store.nick && !store.signalServer) {
      //此处做提示，未连接，先配置
      antdMessage.error({
        content: "连接信令服务器失败。请配置连接",
        duration: 1,        
      })
      return
    }
    else {
      const rtc = new RTCPeer({
        signalServer: store.signalServer,
        nick: store.nick,
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
      rtc.connectPeer()
    }
   
    
  }, [store] )



  useEffect( () => {
    if (message) {
      speak(message)
      .then(
        () => {
          setIsSpeak(false)  
        }
      )
    }
  }, [message])

  const clickSetting = () => {
    setIsSetting(true)
  }
  const cancelModal = () =>{
    setIsSetting(false)
  }
  const submit = () => {
    form.validateFields()
    .then(values => {
      dispatch({
        type: "setConfig",
        payload: values
      })
    }).catch( err => {
      //处理错误
    })
  }
  const speak = (message: string) => {
    return new Promise( (resolve, reject ) => {
      try {
        syc.speak(new SpeechSynthesisUtterance(message))
        resolve(true)
      }
      catch ( err) {
        reject(err)
      }
    })
  }


  const start = () => {
    // SpeechRecognition.startListening({continuous: true})
    SpeechRecognition.startListening()
    setIsSpeak(true)
  }
  const stop = () => {
    SpeechRecognition.stopListening()
    setIsSpeak(false)
  }

  return (
    <div className={style.mainPanel}>
      <SettingOutlined className={style.setting} onClick={clickSetting}/>
      <Modal 
        title="设置" 
        visible={isSetting}
        okText="配置"
        cancelText="取消"
        onCancel={cancelModal}
        onOk={submit}
        >
        <UserConfig form={form} ></UserConfig>
      </Modal>
      {
        !browserSupportsSpeechRecognition ? (
          <div className={style.content}>Browser doesn't support speech recognition.</div>
        ) : (
          <div className={style.content} ref={contentRef}>
            { isSpeak ? (
               transcript
            ) : (
              <div>
                <span>{ message || "我是小H！有什么可以帮到您^v^"}</span>
                <AudioOutlined onClick={start} onTouchEnd={start} />
              </div>
            )}
          </div>
        ) 
      }
    </div>
  )
}

export default Main