/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 15:43:52
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 15:51:54
 */

import * as fs from "fs";
import * as path from 'path';
import * as jsBeautify from 'js-beautify';

const configPath: string = path.resolve(__dirname, '../.config')

interface ServerConfig {
  port: number;
}

let config: ServerConfig = {
  port: 8000
}

try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, jsBeautify.js(JSON.stringify(config)))
}

export default config