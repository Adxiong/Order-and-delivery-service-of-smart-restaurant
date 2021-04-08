from db.exts import db

class User(db.Model):
    __tablename__ = 'user'
    u_id = db.Column(db.Integer, primary_key=True , autoincrement=False)
    u_account = db.Column(db.String(255) , nullable=True)
    u_name = db.Column(db.String(255), unique=True , nullable=True)
    u_pwd = db.Column(db.String(255),nullable=True)

    def __init__(self, id, account, name, pwd):
        self.u_id = id
        self.u_account = account
        self.u_name = name
        self.u_pwd = pwd

    def __repr__(self):
        return '<User: %r, %r, %r>' % (self.u_id, self.u_name, self.u_pwd)


class Type(db.Model):
    __tablename__ = 'type'
    t_id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    t_name = db.Column(db.String(255), nullable=True)
    def __init__(self, id, name):
        self.t_id = id
        self.t_name = name

    def __repr__(self):
        return '<Order: %r, %r>' % (self.t_id, self.t_name)

class Menu(db.Model):
    __tablename__ = 'menu'
    m_id = db.Column(db.Integer, primary_key=True,autoincrement=False)
    m_name = db.Column(db.String(255),nullable=False)
    m_price = db.Column(db.Integer,nullable=False ,default=0.00)
    m_pic = db.Column(db.String(255),nullable=False)
    m_type = db.Column(db.Integer,db.ForeignKey('type.t_id'))
    t_type = db.relationship('Type', backref=db.backref('menu', lazy='dynamic'))

    def __init__(self, id, name, price, pic,type):
        self.m_id = id
        self.m_name = name
        self.m_price = price
        self.m_pic = pic
        self.m_type = type

    def __repr__(self):
        return '<Menu: %r, %r, %r, %r ,%r , %r>' % (self.m_id, self.m_name, self.m_price, self.m_pic,self.m_type,self.t_type.t_name)


class Order(db.Model):
    __tablename__ = 'orders'
    no = db.Column(db.String(10), primary_key=True,autoincrement=False)
    date = db.Column(db.String(50),nullable=False)
    desk = db.Column(db.Integer , nullable=False)
    content = db.Column(db.Text,nullable=False)
    status = db.Column(db.Integer , nullable=False)
    total = db.Column(db.Float,nullable=False)

    def __init__(self, no, date, desk, content ,total ,status):
        self.no = no
        self.desk = desk
        self.date = date
        self.content = content
        self.status = status
        self.total = total

    def __repr__(self):
        return '<Order: %r, %r,%r , %r ,%r ,%r>' % (self.no, self.desk, self.date, self.content ,self.status, self.total)
