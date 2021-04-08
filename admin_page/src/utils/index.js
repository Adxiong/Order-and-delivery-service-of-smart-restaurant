import { Message } from "element-ui";

export const getToken = () => {
  let userInfo = localStorage.getItem("userInfo");
  let token;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    token = userInfo.token;
    if (isExpired(userInfo.expire)) {
      Message.error("登录信息已过期，请重新登录！");
      setTimeout(() => {
        localStorage.clear();
        location.href = "/login";
      }, 2000);
    }
  } else {
    Message.error("请先登录后再使用该功能！");
    setTimeout(() => {
      localStorage.clear();
      location.href = "/login";
    }, 2000);
  }
  return token;
};

export const isExpired = exporTs => {
  const current = Math.floor(new Date().getTime() / 1000);
  return current > exporTs;
};

