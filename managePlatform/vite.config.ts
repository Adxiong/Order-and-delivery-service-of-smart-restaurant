/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-20 14:05:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-20 14:29:31
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
  resolve: {
    alias:[
      { find: /~/, replacement: path.resolve('./', 'node_modules') },
      { find: '@', replacement: path.resolve('./', 'src') }
    ]
  }
})
