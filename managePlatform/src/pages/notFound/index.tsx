/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:40:54
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 14:40:54
 */


import { Button, Result } from "antd";

const NotFound =  () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary">Back Home</Button>
      }
    />
  )
}

export default NotFound
