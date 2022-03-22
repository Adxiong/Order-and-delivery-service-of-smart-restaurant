/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 17:39:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-22 15:31:49
 */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
