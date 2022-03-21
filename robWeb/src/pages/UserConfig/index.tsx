/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 21:46:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 21:51:52
 */
import { Form, Input } from "antd";
import style from "./styles/index.module.less";


const UserConfig = () => {
  return (
    <div className={style.UserConfigPanel}>
      <Form>
        <Form.Item label="机器名">
          <Input></Input>
        </Form.Item>
        <Form.Item label="signal服务器地址">
          <Input></Input>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserConfig
