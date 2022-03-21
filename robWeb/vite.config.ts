/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-21 17:39:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-21 23:29:32
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3001
  },
  resolve: {
    alias:[
      { find: /~/, replacement: path.resolve('./', 'node_modules') },
      { find: '@', replacement: path.resolve('./', 'src') }
    ]
  }
})
