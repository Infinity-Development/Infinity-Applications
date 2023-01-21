const mongo = require('mongoose');

module.exports = mongo.model(
  'staff_apps',
  mongo.Schema({
    appID: { type: String, default: 'none' },
    userID: { type: String, default: 'none' },
    userName: { type: String, default: 'none' },
    experience: { type: String, default: 'none' },
    position: { type: String, default: 'none' },
    reason: { type: String, default: 'none' },
    staff_reason: { type: String, default: 'none' },
    strength: { type: String, default: 'none' },
    handle: { type: String, default: 'none' },
    rules: { type: String, default: 'none' },
    terms: { type: String, default: 'none' },
    status: { type: String, default: 'pending' },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  }),
);
