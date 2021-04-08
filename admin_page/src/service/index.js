import http from "./http";
import { Message } from "element-ui";

const login = (user, password) => {
  const res = http.post("/login", { user, password }, false);
  res
    .then(response => {
      Message({
        message: `欢迎[${response.userinfo.nickname}],登录成功！`,
        type: "success",
        iconClass: "el-icon-success",
        duration: 3000,
        showClose: true,
        center: true
      });
      response.expire = Math.floor(new Date().getTime() / 1000) + 600;
      localStorage.setItem("userInfo", JSON.stringify(response));
    })
    .catch(() => {
      localStorage.clear();
    });
  return res;
};

const getShopInfo =  async()=>{
  return await http.get("/shopinfo",{},true)
}
const updateShopInfo =  async(shopinfo)=>{
  return await http.post('/shopinfo',shopinfo , true)
}

const getAllType = async()=>{
  return await http.get("/typeopt",{},true);
}

const submitTypeInfo = async(type)=>{
  return await http.post('/typeopt' ,type, true)
}

const delTypeInfo = async(type)=>{
  return await http.delete('/typeopt',type,true)
}

const getAllMenu = async()=>{
  return await http.get("/menuopt",{} ,true);
}

const submitMenuInfo = async(menuForm)=>{
  return await http.post('/menuopt' ,menuForm, true)
}

const delMenuInfo = async(menu)=>{
  return await http.delete('/menuopt',menu ,true)
}

const getTodayAllOrder = async()=>{
  return await http.get('/todayallorder',{},true)
}

const getAllOrder = async()=>{
  return await http.get('/allorder',{},true)
}

const delOrder = async(data)=>{
  return await http.delete('/delorder' , data ,true)
}

const updateOrederStatus = async(data)=>{
  return await http.post('/updateOrderStatus',data , true)
}

const getLastOrder = async(no)=>{
  return await http.post('/getLastOrder',no , true)
}

const getclassificationData = async()=>{
  return await http.get('/classificationData',true)
}

const getTableInfo = async()=>{
  return await http.get('/tableinfo' ,{} , true)
}

const updateTableInfo = async(num)=>{
  return await http.post('/tableinfo',num , true)
}

const getOrderStatus = async()=>{
  return await http.get('/getOrderStatus' , {} , true)
}

export default{
  login,
  getShopInfo,
  updateShopInfo,
  getAllType,
  submitTypeInfo,
  delTypeInfo,
  getAllMenu,
  submitMenuInfo,
  delMenuInfo,
  getTodayAllOrder,
  getAllOrder,
  delOrder,
  updateOrederStatus,
  getLastOrder,
  getclassificationData,
  getTableInfo,
  updateTableInfo,
  getOrderStatus
}