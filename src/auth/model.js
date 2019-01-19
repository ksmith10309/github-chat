'use strict';

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
});

userSchema.statics.createFromOAuth = function(incoming) {
  if (!incoming || !incoming.login) {
    return Promise.reject('VALIDATION ERROR: missing username');
  }
  return this.findOne({username:incoming.login})
    .then(user => {
      if (!user) throw new Error ('User Not Found');
      return user;
    })
    .catch(() => {
      return this.create({
        username: incoming.login,
      });
    });
};

export default mongoose.model('users', userSchema);
