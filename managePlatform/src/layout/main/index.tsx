/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:52:55
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 15:31:14
 */

import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useNavigate, Outlet, useLocation, Navigate, useParams } from 'react-router-dom';
import style from "./styles/index.module.less"
import { useEffect, useState } from 'react';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const location = useLocation()
  const [pathname, setPathname] = useState<string>(location.pathname)
  const navigate = useNavigate()
  
  useEffect( () => {
    if (pathname === '/main') {
      navigate(`${pathname}/robots`)
    } else {
      navigate(pathname)
    }
  }, [pathname])
  return (
    <Layout className={style.layoutPanel}> 
      <Header className="header">
        <div className="logo" />
        <div className={style.title}>
          管理中心
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub2']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="机器人调度中心">
              <Menu.Item key="5" onClick={() => setPathname('/main/robots')}>机器人调度</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              // minHeight: 280,
            }}
          >
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout