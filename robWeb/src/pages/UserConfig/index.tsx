/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 21:46:47
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 14:31:21
 */
import { Form, Input } from "antd";
import { FormInstance, useForm } from "antd/lib/form/Form";
import style from "./styles/index.module.less";



const UserConfig = ({form}: {form: FormInstance<any>}) => {
  return (
    <div className={style.UserConfigPanel}>
      <Form
        form={form}
        labelCol={{span:7}} 
        wrapperCol={{span:12}}
        >
        <Form.Item 
          label="机器名" 
          name="nick"
          rules={[
            {required: true}
          ]}
          >
          <Input></Input>
        </Form.Item>
        <Form.Item 
          label="signal服务器地址" 
          name="signalServer"
          rules={[
            {required: true}
          ]}
          >
          <Input></Input>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserConfig
