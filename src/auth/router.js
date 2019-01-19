'use strict';

import express from 'express';

import oauth from './oauth.js';

const authRouter = express.Router();

authRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req)
    .then((user) => {
      res.render('chatroom', {username: JSON.stringify(user.username)});
    })
    .catch(next);
});

export default authRouter;
