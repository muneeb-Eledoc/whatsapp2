from flask import Flask, render_template
from flask_socketio import SocketIO, emit, send
# from flask_session import Session
from flask_cors import CORS
from flask import request


app = Flask(__name__)
app.config['SECRET_KEY'] = '@Athe!'
# app.config['SESSION_TYPE'] = 'filesystem'
# app.config['CORS_HEADERS'] = 'Content-Type'
# cors = CORS(app, resources={r"/": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

# Session(app)
users = []

def userAlreadyExists(newUserId):
    for user in users:
        if(user['userId'] == newUserId):
            return True
        else:
            return False

@app.route("/")
def hello_world():
    return render_template('index.html')

@socketio.on('connect')
def test_connect():
    pass

@socketio.on('userId')
def getUserId(newUserId):
    userExistance = userAlreadyExists(newUserId)
    if userExistance:
        return
    else:
        currentSocketId = request.sid
        users.append({
            'socketId': currentSocketId,
            'userId': newUserId
        })
        print(users)

def findUser(userId):
    for user in users:
        if(user['userId'] == userId):
            return user

@socketio.on('newMessage', namespace='/message/')
def newMessage(userId):
    recipientUser = findUser(userId);
    if recipientUser is not None:
      User['socketId'])

if __name__ == '__main__':
    socketio.run(app)  socketio.emit('messagereceived', {"data": "new_message"}, room=recipientUser['socketId'])
        print('new '+ recipient