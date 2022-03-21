/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 21:15:48
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 21:38:51
 */


import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "../pages/notFound";
import Main from "../pages/main";


interface RouterType  {
  path: string
  element: JSX.Element
  children?: RouterType[]
}

const routes: RouterType[] = [
  {
    path: '/',
    element: <Navigate replace to='/main'/>
  },
  {
    path: '/main',
    element: <Main/>,
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '*',
    element: <Navigate replace to={'/404'}/>
  }
]

const Routes = () => {
  return useRoutes(routes)
}

export default Routes