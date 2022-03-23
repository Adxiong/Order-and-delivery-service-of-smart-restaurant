/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-23 14:03:34
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-23 15:19:37
 */

import { useReducer, createContext, Dispatch} from 'react'


interface StateType {
  nick: string;
  signalServer: string;
}



const reducer = (state: StateType, actions: {type: string, payload: any}) => {
  switch (actions.type){
    case "setConfig": 
      return {
        nick: actions.payload.nick,
        signalServer: actions.payload.signalServer
      }
    default:
      return state
  }
}

interface ContextInterface {
  store: StateType,
  dispatch: Dispatch<{ 
    type: string;
    payload: any;
  }>
}

export const StoreContext = createContext({} as ContextInterface)

const Store= ({children}) => {
  const [ store, dispatch ] = useReducer(reducer, {} as StateType)

  return (
    <StoreContext.Provider value={{store,dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export default Store
