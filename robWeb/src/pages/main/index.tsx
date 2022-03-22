/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 21:39:26
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-22 17:16:22
 */
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition"
import { useEffect, useRef, useState } from "react"
import style from "./styles/index.module.less"
import { AudioOutlined } from "@ant-design/icons"


const Main = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState<string>()
  const [isSpeak, setIsSpeak] = useState<boolean>(false)
  const syc = window.speechSynthesis
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
  useEffect( () => {
    if (message) {
      speak(message)
      .then(
        () => {
          console.log("说完");
          setIsSpeak(false)  
        }
      )
    }
  }, [message])

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