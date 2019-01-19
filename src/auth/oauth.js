'use strict';

import superagent from 'superagent';

import User from './model.js';

const authorize = (req) => {
  let code = req.query.code;

  return superagent.post('https://github.com/login/oauth/access_token')
    .send({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth`,
    })

    .then(res => {
      let token = res.body.access_token;
      return token;
    })

    .then(token => {
      return superagent.get(`https://api.github.com/user?access_token=${token}`)
        .then(res => {
          let incoming = res.body;
          return incoming;
        });
    })

    .then(incoming => {
      return User.createFromOAuth(incoming);
    })

    .catch(error => error);

};

export default {authorize};
