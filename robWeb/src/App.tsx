/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 17:39:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:41:14
 */
import { SettingOutlined } from '@ant-design/icons'
import style from "./app.module.less"
import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import UserConfig from './pages/UserConfig'

function App() {
  const [count, setCount] = useState(0)
  const [isSetting, setIsSetting] = useState<boolean>(false)

  useEffect( () => {
  }, [])
  const clickSetting = () => {
    setIsSetting(true)
  }
  const cancelModal = () =>{
    setIsSetting(false)
  }
  return (
    <div className={style.App}>
      <SettingOutlined className={style.setting} onClick={clickSetting}/>
      <Modal 
        title="设置" 
        visible={isSetting}
        onCancel={cancelModal}
        >
        <UserConfig></UserConfig>
      </Modal>
      我是小H！有什么可以帮到您^v^
    </div>
  )
}

export default App
