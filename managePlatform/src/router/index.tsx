/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:34:59
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 15:38:30
 */

import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "../pages/notFound";
import MainLayout from "../layout/main";
import Login from "../pages/login";
import Robots from "../pages/robots";


interface RouteType {
  path: string;
  element: JSX.Element;
  children?: RouteType[];
}

const routes: RouteType[] = [
  {
    path: '/',
    element: <Navigate replace to='/main'/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/main',
    element: <MainLayout/>,
    children: [
      {
        path: '/main/robots',
        element: <Robots/>
      }
    ]
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

const Routers = () => {
  return useRoutes(routes)
}

export default Routers