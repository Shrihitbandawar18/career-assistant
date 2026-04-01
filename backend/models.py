from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()
timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    action = db.Column(db.String(100))
    result = db.Column(db.Text)