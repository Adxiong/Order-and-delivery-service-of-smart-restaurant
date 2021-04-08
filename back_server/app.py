from flask import Flask,request,jsonify
from db.exts import db
from db.models import User,Order,Menu ,Type
import time
from flask_cors import CORS
import config
import common.tool as tools
import json
import os
import datetime
import shutil

app = Flask(__name__)
app.config.from_object(config)

CORS(app)
hasOrder = False

with app.app_context():
    db.init_app(app)
    # db.drop_all()
    # db.create_all()
    # data = User(0,'100','admin','admin')
    # db.session.add(data)
    # db.session.commit()


@app.route('/')
def hello_world():

    return 'Hello World!'

# 生成餐桌码保存
def getCode():
    for i in range(0,config.SHOPINFO['table_num']):
        result = tools.createQRCode(f"/pages/goods/good?no={i+1}")
        path = os.path.join(os.getcwd(), 'static/table')
        savePath = os.path.join(path,str(i+1))
        with open(f'{savePath}.png', 'wb') as f:
            f.write(result.content)


#获取餐桌信息
@app.route('/tableinfo' , methods=["GET","POST"])
def TableInfo():
    if request.method == "GET":
        data = []
        for i in range(1,config.SHOPINFO['table_num']+1):
            data.append({
                "no" : i,
                "adr":f"/static/table/{i}.png"
            })
            print(data)
        return jsonify({"msg":"ok","num":config.SHOPINFO['table_num'],"data":data}),200
    if request.method == "POST":
        num = request.json['num']
        config.SHOPINFO['table_num'] = num
        path = os.path.join(os.getcwd(), 'static/table')
        shutil.rmtree(path)
        os.mkdir(path)
        getCode()
        return jsonify({'msg':'修改成功'}),200


#获取店铺信息 修改店铺信息
@app.route('/shopinfo' , methods=["GET","POST"])
def Shopinfo():
    if request.method == "GET":
        data =  config.SHOPINFO

        return jsonify({"msg":"OK" , "data" :data}),200

    if request.method == "POST":
        shopinfo = request.json
        config.SHOPINFO = shopinfo
        return jsonify({"msg":"修改成功"}),200


@app.route('/login' , methods=["POST"])
def Login():
    if request.method == "POST":
        user = request.json.get('user')
        pwd = request.json.get('password')
        res = User.query.filter_by(u_account=user).first()
        if res == None:
            return jsonify({'msg':"用户不存在"}),301
        elif res.u_pwd  != pwd:
            return jsonify({'msg': "密码错误"}), 301
        else:
            return jsonify({'userinfo':{'user': user , 'nickname':res.u_name }})

#菜单操作
@app.route('/menuopt',methods=["POST","GET","DELETE"])
def Menuopt():
    if request.method == "GET":
        res = Menu.query.all()
        data = []
        for i in res:
            data.append({
                "id": i.m_id,
                "name": i.m_name,
                "price": i.m_price,
                "pic": i.m_pic,
                "type": i.m_type,
                "typename": i.t_type.t_name,
                "num":0
            })
        return jsonify({"msg": "ok", "data": data}), 200
    if request.method == "POST":
        if request.form.get('name') and request.form.get('type'):
            name = request.form.get('name')
            price = request.form.get('price')
            pic = request.files.get('pic')
            path = os.path.join(os.getcwd(), 'static')
            picname = name + pic.filename[pic.filename.rfind('.'):]
            picsavepath = os.path.join(path,picname)
            pic.save(picsavepath)
            type = request.form.get('type')
            if Type.query.filter_by(t_id=type).first():
                id =  int(time.time())
                sql = Menu(id=id,name=name,price=price,pic='/static/'+picname,type=type )
                db.session.add(sql)
                db.session.commit()
                return jsonify({'msg':'OK'}),200
            else:
                return jsonify({'msg':'fail'}),302
        else:
            return jsonify({'msg':'fail'}),302

    if request.method == 'DELETE':
        id = request.json['id']
        result = Menu.query.filter_by(m_id=id).first()
        if result:
            db.session.delete(result)
            db.session.commit()
            return jsonify({'msg':"删除成功"}),200
        else:
            return jsonify({'msg': "信息不存在"}), 302


# 菜品类型操作
@app.route("/typeopt" , methods=["GET","POST","DELETE"])
def Typeopt():
    if request.method == "GET":
        res = Type.query.all()
        data = []
        for i in res :
            data.append({
                "id":i.t_id,
                "name":i.t_name
            })
        return jsonify({"msg":"ok" , "data":data}),200

    if request.method == "POST":
        id = request.json["id"]
        name = request.json["name"]
        sql = Type(id=id, name=name)
        db.session.add(sql)
        db.session.commit()
        return jsonify({'msg': 'OK'}), 200

    if request.method == 'DELETE':
        id = request.json['id']
        result = Type.query.filter_by(t_id=id).first()
        if result:
            db.session.delete(result)
            db.session.commit()
            return jsonify({'msg':"删除成功"}),200
        else:
            return jsonify({'msg': "信息不存在"}), 302

#获取所有订单
@app.route("/allorder" , methods=["GET"])
def getAllOrder():
    result = Order.query.all()
    data = []
    for item in result:
        data.append({
            "no": item.no,
            "desk": item.desk,
            "content": json.loads(item.content),
            "status": item.status,
            "total": item.total,
        })
    return jsonify({"msg": "ok", "data": data}), 200

#获取今日订单
@app.route("/todayallorder" , methods=["GET"])
def gettodayAllOrder():
    tt = str(datetime.datetime.now())[:10]
    result = Order.query.filter_by(date=tt).all()
    data = []
    for item in result:
        data.append({
            "no":item.no,
            "desk":item.desk,
            "date":item.date,
            "content":json.loads(item.content),
            "status":item.status,
            "total":item.total,
        })
    return jsonify({"msg":"ok","data":data}),200

#获取近x日订单
@app.route("/getLastOrder" , methods=["POST"])
def getLastOrder():
    n = request.json['no']
    now_day = datetime.datetime.now()
    stime = []
    content = {}
    for i in range(0,n):
        oneday = datetime.timedelta(days=i)
        stime.append(str(now_day - oneday)[:10])

    for t in stime:
        result = Order.query.filter_by(date=t).all()
        data = []
        for item in result:
            data.append({
                "no": item.no,
                "desk": item.desk,
                "date": item.date,
                "content": json.loads(item.content),
                "status": item.status,
                "total": item.total,
            })
        content[t] = data
    return jsonify({"msg":"ok","data":content}),200

#是否有新订单
@app.route("/getOrderStatus" , methods=["GET"])
def getOrderStatus():
    global  hasOrder
    if hasOrder:
        hasOrder = False
        return jsonify({"msg":"has"}),200
    else :
        return jsonify({"msg":"no"}),200

#更新订单状态
@app.route("/updateOrderStatus",methods=["POST"])
def updateOrderStatus():
    global hasOrder
    data = request.json
    status = request.json['status']
    for item in data['datas']:
        no = item['no']
        res = Order.query.filter_by(no=no).first()
        if res :
            res.status = status
            db.session.commit()

    return jsonify({'msg': "成功"}), 200

#删除订单
@app.route("/delorder",methods=["DELETE"])
def delOrder():
    data = request.json
    for item in data:
        no = item['no']
        result = Order.query.filter_by(no = no).first()
        if result:
            db.session.delete(result)
            db.session.commit()
        else:
            return jsonify({"msg": "数据不存在"}), 302
    return jsonify({"msg":"成功"}),200

#添加订单
@app.route("/addorder",methods=["POST"])
def addOrder():
    global hasOrder
    content = json.dumps(request.json['data'])
    desk = request.json['tableno']
    status = request.json['status']
    total = request.json['total']
    date = str(datetime.datetime.now())[:10]
    cid = str(int(time.time()))
    sql = Order(no=cid,desk=desk,date=date, content=content,status=status, total=total)
    db.session.add(sql)
    db.session.commit()
    hasOrder = True
    return jsonify({"msg":"ok"}),200

#获取各类菜单各有多少道菜
@app.route("/classificationData" , methods=["GET"])
def classificationData():
    result = Type.query.all()
    data = []
    for res in result:
        data.append({
            "value":res.menu.count(),
            "name":res.t_name
        })
    return  jsonify({"msg":"ok","list":data}),200


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=5000)
