/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 17:40:26
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 17:49:36
 */

import * as express from 'express';
import * as cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import * as session from "express-session";

// import api from './controll'

import * as cors from 'cors';
import config from './config';
import logger from './utils/logger';

const app = express()

app.use(cors())



app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// app.use('/api', api)


app.listen (config.port, "0.0.0.0", () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})