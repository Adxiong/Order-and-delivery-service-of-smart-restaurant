APPID = "wx734ed0ba10438ba5"
APPSECRET = "00a9fbef76dfb222789378a6ead51eb1"

DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'       #数据库登录ID
PASSWORD = '123456'     #数据库登录密码
HOSTNAME = '127.0.0.1'      #数据库地址
PORT = '3306'
DATABASE = 'restaurant'       #数据库名

SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8'

SQLALCHEMY_TRACK_MODIFICATIONS= False

SHOPINFO = {
    "name" : '简餐厅',
    'details' : '本平台只提供指定餐桌点餐。线下结账(参加比赛作品,切勿商用)',
    'tel' : '1235645564',
    'address' : '南北巷31号',
    'start_time' : "Fri Mar 12 2021 08:30:00 GMT+0800 (中国标准时间)",
    'end_time' : "Fri Mar 12 2021 11:30:00 GMT+0800 (中国标准时间)",
    'table_num':8
}




def wxacode(ACCESS_TOKEN):
    # 获取小程序码的请求地址
    # param access_token
    return f"https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token={ACCESS_TOKEN}"

def authGetAccessToken():
    #获取小程序全局唯一后台接口调用凭据（access_token）
    return  f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}"


