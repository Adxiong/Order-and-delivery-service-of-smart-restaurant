/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 15:47:54
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:47:54
 */


import * as log4js from 'log4js';
import * as path from 'path';

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../../logs/clever-compiler.log`),
      alwaysIncludePattern: true,
      daysToKeep: 5
    }
  },
  categories: {
    default: {
      appenders: ['console','file'],
      level: 'info'
    }
  },
  pm2: true
})
const logger = log4js.getLogger()
export default logger