import requests
import config
import json
def createQRCode(path):
    # 生成小程序码
    # access_token 接口凭证
    # path 页面路径，最大长度128字节，不能为空
    # 成功返回图片Buffer，失败返回json
    access_token = getWxAccessToken()["access_token"]
    url = config.wxacode(access_token)
    data = {
        "path":path,
        "width":150
    }
    # print(json.dumps(data))
    result =requests.post(url,json=data)
    return result

def getWxAccessToken():
    url = config.authGetAccessToken()
    result = requests.get(url).json()
    return result