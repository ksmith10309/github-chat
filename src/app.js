'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import authRouter from './auth/router.js';

let app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('./public'));

app.use(authRouter);

app.get('/', (req, res) => {
  let githubURL = 'https://github.com/login/oauth/authorize';
  let queryString = `client_id=${process.env.CLIENT_ID}`;
  let authURL = `${githubURL}?${queryString}`;
  res.render('home', {url: authURL});
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.statusCode = err.status || 500;
  res.statusMessage = err.message || 'Server Error';
  res.setHeader('Content-Type', 'text/html');
  res.render('error', {code: res.statusCode, message: res.statusMessage});
});

let users = [];

io.on('connection', (socket) => {
  socket.on('add user', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('user list', users);
    io.emit('chat message', '- ' + socket.username + ' has joined GitChatApp -');
  });

  socket.on('chat message', (msg) => {
    let currentdate = new Date();
    let minutes = currentdate.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : '0' + minutes;
    let time = currentdate.getHours() + ':' + minutes;
    io.emit('chat message', `${socket.username} [${time}]: ${msg}`);
  });

  socket.on('disconnect', () => {
    let index = users.findIndex(user => user == socket.username);
    users.splice(index, 1);
    io.emit('user list', users);
    io.emit('chat message', '- ' + socket.username + ' has left GitChatApp -');
  });
});

module.exports = {
  app: app,
  start: (port) => {
    http.listen(port, (err) => {
      if (err) console.log(err.message);
      console.log(`Listening on port ${port}`);
    });
  },
};
