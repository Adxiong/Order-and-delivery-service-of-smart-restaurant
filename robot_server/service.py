#!/usr/bin/env python
from flask import Flask,request,jsonify
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

@app.route('/',methods=["POST"])
def hello_world():
    x ,y= request.json['point']
    print x,y
    command = 'rosrun rbx1_nav gotopose.py '+str(x)+' '+str(y)
    os.system(command)
    return jsonify({'msg':'hello world'}),200

if __name__ == '__main__':
    app.run(debug=True, host='192.168.123.103',port=5000)