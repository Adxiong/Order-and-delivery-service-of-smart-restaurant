/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 15:42:19
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:53:10
 */
import * as express from 'express';
import * as cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import * as session from "express-session";
import * as http from 'http';
// import api from './controll'
import SocketServer from './socket';

import * as cors from 'cors';
import config from './config';
import logger from './utils/logger';

const app = express()

app.use(cors())

const service = http.createServer(app)

const socket = new SocketServer(service)

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// app.use('/api', api)


service.listen (config.port, "0.0.0.0", () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})